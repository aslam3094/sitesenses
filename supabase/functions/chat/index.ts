import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Generate embedding for query using MiniMax
async function generateQueryEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.minimax.chat/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'embo-01',
      text: text,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`MiniMax API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const MINIMAX_API_KEY = Deno.env.get('MINIMAX_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!MINIMAX_API_KEY && !LOVABLE_API_KEY) {
      console.error('MINIMAX_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header to identify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the latest user message for semantic search
    const latestMessage = messages[messages.length - 1];
    const query = latestMessage?.content || '';

    console.log('Processing chat for user:', user.id, 'query:', query.substring(0, 100));

    let knowledgeContext = '';
    let useSemanticSearch = false;

    // Try semantic search if MiniMax key is available
    if (MINIMAX_API_KEY && query) {
      try {
        // Generate embedding for the query
        const queryEmbedding = await generateQueryEmbedding(query, MINIMAX_API_KEY);
        
        // Search for relevant chunks using vector similarity
        const { data: matches, error: matchError } = await supabase.rpc('match_embeddings', {
          query_embedding: `[${queryEmbedding.join(',')}]`,
          match_threshold: 0.5,
          match_count: 8,
          p_user_id: user.id
        });

        if (!matchError && matches && matches.length > 0) {
          useSemanticSearch = true;
          console.log(`Found ${matches.length} relevant chunks via semantic search`);
          
          // Build context from matched chunks
          knowledgeContext = matches.map((m: { chunk_text: string; similarity: number }, i: number) => 
            `[Chunk ${i + 1} - Relevance: ${(m.similarity * 100).toFixed(1)}%]\n${m.chunk_text}`
          ).join('\n\n---\n\n');
        }
      } catch (embedError) {
        console.error('Semantic search error, falling back to full text:', embedError);
      }
    }

    // Fallback to full text if no semantic search results
    if (!useSemanticSearch) {
      const { data: sources, error: sourcesError } = await supabase
        .from('knowledge_sources')
        .select('name, extracted_text, source_type')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('extracted_text', 'is', null);

      if (!sourcesError && sources && sources.length > 0) {
        knowledgeContext = sources.map(s => {
          const sourceType = s.source_type === 'url' ? 'Website' : 'Document';
          // Limit each source to prevent context overflow
          const text = s.extracted_text.length > 3000 
            ? s.extracted_text.substring(0, 3000) + '...' 
            : s.extracted_text;
          return `--- ${sourceType}: ${s.name} ---\n${text}`;
        }).join('\n\n');
      }
    }

    // Build system prompt with strict RAG constraints
    const systemPrompt = knowledgeContext 
      ? `You are a knowledge base assistant that answers questions EXCLUSIVELY using the provided context.

ABSOLUTE RULES - FOLLOW EXACTLY:
1. You MUST ONLY use information explicitly stated in the CONTEXT below.
2. If the answer is NOT in the context, respond EXACTLY with: "I don't have that information yet."
3. NEVER use your general knowledge, training data, or make assumptions.
4. NEVER hallucinate, guess, or infer beyond what is explicitly stated.
5. Do NOT say things like "based on my knowledge" or "generally speaking".
6. If only partial information is available, share what you found and say:
   "I don't have complete information on this topic yet."
7. When answering, carefully synthesize the information from the provided context.
8. Respond in a friendly and helpful manner.
9. Present answers clearly in point-wise format based only on the information found in the context.
10. Be concise and directly reference the context.

CONTEXT:
${knowledgeContext}

Remember: If it's not in the CONTEXT above, say "I don't have that information yet." — no exceptions.`
      : `You are a knowledge base assistant.

IMPORTANT: There are no knowledge sources configured yet. 

For ANY question the user asks, respond with:

"I don't have any knowledge sources to answer your question yet. Please add content (website URLs or documents) to the Knowledge Sources page first."

Do not attempt to answer any questions using your general knowledge.`;

    console.log('Using', useSemanticSearch ? 'semantic search' : 'full text', 'with context length:', knowledgeContext.length);

    // Call MiniMax API with streaming
    const aiApiKey = MINIMAX_API_KEY || LOVABLE_API_KEY;
    const aiEndpoint = MINIMAX_API_KEY 
      ? 'https://api.minimax.chat/v1/text/chatcompletion_v2' 
      : 'https://ai.gateway.lovable.dev/v1/chat/completions';
    const aiModel = MINIMAX_API_KEY ? 'MiniMax-Text-01' : 'google/gemini-3-flash-preview';
    
    const response = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

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
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
