import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Generate embedding for query using OpenAI
async function generateQueryEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user exists
    const { data: userCheck, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userCheck?.user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid user ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the latest user message for semantic search
    const latestMessage = messages[messages.length - 1];
    const query = latestMessage?.content || '';

    console.log('Widget chat for user:', userId, 'query:', query.substring(0, 100));

    let knowledgeContext = '';
    let useSemanticSearch = false;

    // Try semantic search if OpenAI key is available
    if (OPENAI_API_KEY && query) {
      try {
        const queryEmbedding = await generateQueryEmbedding(query, OPENAI_API_KEY);
        
        const { data: matches, error: matchError } = await supabase.rpc('match_embeddings', {
          query_embedding: `[${queryEmbedding.join(',')}]`,
          match_threshold: 0.5,
          match_count: 8,
          p_user_id: userId
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

    // Fallback to full text if no semantic search results
    if (!useSemanticSearch) {
      const { data: sources, error: sourcesError } = await supabase
        .from('knowledge_sources')
        .select('name, extracted_text, source_type')
        .eq('user_id', userId)
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

    // Build system prompt with strict RAG constraints
    const systemPrompt = knowledgeContext 
      ? `You are a helpful customer support assistant that answers questions EXCLUSIVELY using the provided context.

RULES:
1. ONLY use information from the CONTEXT below.
2. If the answer is NOT in the context, respond: "I don't have that information yet. Please contact our support team for help."
3. NEVER use general knowledge or make assumptions.
4. Be concise, friendly, and helpful.
5. If only partial information is available, share what you found.

CONTEXT:
${knowledgeContext}`
      : `You are a customer support assistant.

There is no knowledge base content available yet. Respond with:
"I'm still learning about this topic. Please contact our support team directly for assistance."`;

    console.log('Using', useSemanticSearch ? 'semantic search' : 'full text', 'with context length:', knowledgeContext.length);

    // Call Lovable AI Gateway with streaming
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
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
          JSON.stringify({ success: false, error: 'Service temporarily unavailable.' }),
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

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Widget chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
