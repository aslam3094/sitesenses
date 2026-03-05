import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TARGET_EMBEDDING_DIMENSION = 1536;

async function generateHuggingFaceEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
  }

  const embedding: number[] = await response.json();

  if (embedding.length < TARGET_EMBEDDING_DIMENSION) {
    const padded = new Array(TARGET_EMBEDDING_DIMENSION).fill(0);
    for (let i = 0; i < embedding.length; i++) {
      padded[i] = embedding[i];
    }
    return padded;
  }

  return embedding;
}

async function generateGroqChatCompletion(messages: any[], apiKey: string, systemPrompt: string): Promise<Response> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      stream: true,
    }),
  });

  return response;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, chatbotId, userId } = await req.json();

    if (!chatbotId && !userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Chatbot ID or User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    const HF_API_KEY = Deno.env.get('HF_API_KEY');

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Groq API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let userIdToUse = userId;
    let chatbotInfo = null;

    if (chatbotId) {
      const { data: chatbot, error: chatbotError } = await supabase
        .from('chatbots')
        .select('*')
        .eq('id', chatbotId)
        .single();

      if (chatbotError || !chatbot) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid chatbot ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      chatbotInfo = chatbot;
      userIdToUse = chatbot.user_id;
    }

    const latestMessage = messages[messages.length - 1];
    const query = latestMessage?.content || '';

    console.log('Widget chat:', chatbotId ? `chatbot ${chatbotId}` : `user ${userId}`, 'query:', query.substring(0, 100));

    let knowledgeContext = '';
    let useSemanticSearch = false;

    let sourceIds: string[] = [];

    if (chatbotId) {
      const { data: chatbotSources, error: csError } = await supabase
        .from('chatbot_sources')
        .select('source_id')
        .eq('chatbot_id', chatbotId);

      if (!csError && chatbotSources) {
        sourceIds = chatbotSources.map(cs => cs.source_id);
      }
    }

    if (sourceIds.length === 0 && userIdToUse) {
      const { data: userSources, error: usError } = await supabase
        .from('knowledge_sources')
        .select('id')
        .eq('user_id', userIdToUse)
        .eq('status', 'completed');

      if (!usError && userSources) {
        sourceIds = userSources.map(s => s.id);
      }
    }

    // Semantic search if we have HF API key and sources
    if (HF_API_KEY && query && sourceIds.length > 0) {
      try {
        console.log('Using Hugging Face for embeddings');
        const queryEmbedding = await generateHuggingFaceEmbedding(query, HF_API_KEY);

        const { data: matches, error: matchError } = await supabase.rpc('match_embeddings_by_sources', {
          query_embedding: `[${queryEmbedding.join(',')}]`,
          match_threshold: 0.5,
          match_count: 8,
          p_source_ids: sourceIds
        });

        if (!matchError && matches && matches.length > 0) {
          useSemanticSearch = true;
          console.log(`Found ${matches.length} relevant chunks via semantic search`);

          knowledgeContext = matches.map((m: { chunk_text: string; similarity: number }, i: number) =>
            `[Chunk ${i + 1} - Relevance: ${(m.similarity * 100).toFixed(1)}%]\n${m.chunk_text}`
          ).join('\n\n---\n\n');
        }
      } catch (embedError) {
        console.error('Semantic search error, falling back to full text:', embedError);
      }
    }

    if (!useSemanticSearch && sourceIds.length > 0) {
      const { data: sources, error: sourcesError } = await supabase
        .from('knowledge_sources')
        .select('name, extracted_text, source_type')
        .in('id', sourceIds)
        .eq('status', 'completed')
        .not('extracted_text', 'is', null);

      if (!sourcesError && sources && sources.length > 0) {
        knowledgeContext = sources.map(s => {
          const sourceType = s.source_type === 'url' ? 'Website' : 'Document';
          const text = s.extracted_text.length > 3000
            ? s.extracted_text.substring(0, 3000) + '...'
            : s.extracted_text;
          return `--- ${sourceType}: ${s.name} ---\n${text}`;
        }).join('\n\n');
      }
    }

    const systemPrompt = knowledgeContext
      ? `You are a helpful, friendly, and knowledgeable AI assistant.

RESPONSE STYLE:
1. Be warm and conversational - greet users naturally and engage in small talk
2. Be confident and direct - never use hedging phrases like "based on the context", "appears to be", "seems to", or "it looks like"
3. Present information clearly:
   - Use well-formatted paragraphs with proper spacing
   - Use bullet points (•) or numbered lists for multiple items
   - Bold important terms using **text**
4. Don't mention where the information comes from - just present it naturally
5. If you don't know something, say it simply without referencing any "context" or "sources"

KNOWLEDGE BASE:
${knowledgeContext}

Remember: Answer confidently, format nicely with paragraphs and bullet points, and never use hedging language.`
      : `You are a helpful, friendly AI assistant.

RESPONSE STYLE:
1. Be warm and conversational - greet users naturally
2. Be confident and direct - no hedging phrases
3. Use well-formatted paragraphs and bullet points (•) for lists
4. Bold important terms using **text**

Currently, no knowledge sources have been added to this chatbot. For specific questions, you'll need to let the user know that information hasn't been added yet.`;

    console.log('Using', useSemanticSearch ? 'semantic search' : 'full text', 'with context length:', knowledgeContext.length);

    // Use Groq for chat completion
    console.log('Calling Groq API for chat completion');
    const response = await generateGroqChatCompletion(messages, GROQ_API_KEY, systemPrompt);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `AI service error: ${response.status} - ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Widget chat error:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
