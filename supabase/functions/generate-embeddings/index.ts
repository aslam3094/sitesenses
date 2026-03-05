import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Constants for chunking
const MIN_CHUNK_SIZE = 500; // tokens
const MAX_CHUNK_SIZE = 800; // tokens
const CHARS_PER_TOKEN = 4; // approximate

// Target embedding dimension (HF uses 384, padded to 1536)
const TARGET_EMBEDDING_DIMENSION = 1536;

// Split text into chunks of 500-800 token
function splitIntoChunks(text: string): { text: string; tokenCount: number }[] {
  const chunks: { text: string; tokenCount: number }[] = [];

  // Clean and normalize text
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!cleanedText) return chunks;

  // Split by paragraphs first
  const paragraphs = cleanedText.split(/\n\n+/);

  let currentChunk = '';
  let currentTokens = 0;

  for (const paragraph of paragraphs) {
    const paragraphTokens = Math.ceil(paragraph.length / CHARS_PER_TOKEN);

    // If paragraph alone exceeds max, split it further
    if (paragraphTokens > MAX_CHUNK_SIZE) {
      // Save current chunk if exists
      if (currentChunk) {
        chunks.push({ text: currentChunk.trim(), tokenCount: currentTokens });
        currentChunk = '';
        currentTokens = 0;
      }

      // Split large paragraph by sentences
      const sentences = paragraph.split(/(?<=[.!?])\s+/);

      for (const sentence of sentences) {
        const sentenceTokens = Math.ceil(sentence.length / CHARS_PER_TOKEN);

        if (currentTokens + sentenceTokens > MAX_CHUNK_SIZE && currentChunk) {
          chunks.push({ text: currentChunk.trim(), tokenCount: currentTokens });
          currentChunk = '';
          currentTokens = 0;
        }

        currentChunk += (currentChunk ? ' ' : '') + sentence;
        currentTokens += sentenceTokens;

        // If we've reached min size and sentence ends naturally, consider breaking
        if (currentTokens >= MIN_CHUNK_SIZE && sentence.match(/[.!?]$/)) {
          chunks.push({ text: currentChunk.trim(), tokenCount: currentTokens });
          currentChunk = '';
          currentTokens = 0;
        }
      }
    } else {
      // Check if adding this paragraph exceeds max
      if (currentTokens + paragraphTokens > MAX_CHUNK_SIZE && currentChunk) {
        chunks.push({ text: currentChunk.trim(), tokenCount: currentTokens });
        currentChunk = '';
        currentTokens = 0;
      }

      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      currentTokens += paragraphTokens;

      // If we've reached a good size, save the chunk
      if (currentTokens >= MIN_CHUNK_SIZE) {
        chunks.push({ text: currentChunk.trim(), tokenCount: currentTokens });
        currentChunk = '';
        currentTokens = 0;
      }
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim()) {
    chunks.push({ text: currentChunk.trim(), tokenCount: currentTokens });
  }

  return chunks;
}

// Generate embeddings using Hugging Face
async function generateEmbeddingHuggingFace(text: string, apiKey: string): Promise<number[]> {
  console.log('Calling Hugging Face embeddings API for text length:', text.length);

  const response = await fetch('https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
    }),
  });

  const responseText = await response.text();
  console.log('Hugging Face API response status:', response.status);

  if (!response.ok) {
    console.error('Hugging Face API error response:', responseText);
    throw new Error(`Hugging Face API error: ${response.status} - ${responseText}`);
  }

  let embedding: number[];
  try {
    const data = JSON.parse(responseText);
    // Hugging Face returns array of embeddings, take the first one
    if (Array.isArray(data) && Array.isArray(data[0])) {
      embedding = data[0];
    } else if (Array.isArray(data)) {
      embedding = data;
    } else {
      throw new Error('Unexpected Hugging Face response format');
    }
  } catch (parseError) {
    console.error('Failed to parse Hugging Face response:', responseText);
    throw new Error(`Failed to parse Hugging Face response: ${responseText}`);
  }

  console.log(`Hugging Face returned ${embedding.length} dimensions`);

  // Pad HF embeddings (384 dimensions) to match target (1536 dimensions) with zeros
  if (embedding.length < TARGET_EMBEDDING_DIMENSION) {
    const padding = new Array(TARGET_EMBEDDING_DIMENSION - embedding.length).fill(0);
    embedding = [...embedding, ...padding];
    console.log(`Padded embedding to ${embedding.length} dimensions`);
  }

  return embedding;
}

// Generate embeddings using Hugging Face
async function generateEmbedding(text: string, hfKey: string): Promise<number[]> {
  console.log('Using Hugging Face for embeddings');
  const embedding = await generateEmbeddingHuggingFace(text, hfKey);
  console.log('Successfully generated embedding using Hugging Face');
  return embedding;
}

// Update knowledge source status with error info
async function updateKnowledgeSourceStatus(
  supabase: ReturnType<typeof createClient>,
  sourceId: string,
  userId: string,
  status: 'pending' | 'processing' | 'completed' | 'error',
  errorMessage?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    processing_stage: status === 'error' ? 'error' : status,
    updated_at: new Date().toISOString(),
  };

  if (errorMessage) {
    updateData.error_message = errorMessage;
  }

  if (metadata) {
    updateData.metadata = metadata;
  }

  const { error } = await supabase
    .from('knowledge_sources')
    .update(updateData)
    .eq('id', sourceId)
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to update knowledge source status:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sourceId } = await req.json();

    if (!sourceId) {
      return new Response(
        JSON.stringify({ success: false, error: 'sourceId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const HF_API_KEY = Deno.env.get('HF_API_KEY');

    // Require HF_API_KEY
    if (!HF_API_KEY) {
      console.error('HF_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'HF_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Using Hugging Face for embeddings');

    // Get authorization header to identify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
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

    console.log('Generating embeddings for source:', sourceId, 'user:', user.id);

    // Fetch the knowledge source
    const { data: source, error: sourceError } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('id', sourceId)
      .eq('user_id', user.id)
      .single();

    if (sourceError || !source) {
      return new Response(
        JSON.stringify({ success: false, error: 'Knowledge source not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!source.extracted_text || source.extracted_text.trim().length === 0) {
      console.error('No extracted text available or text is empty. Source:', source);
      await updateKnowledgeSourceStatus(
        supabase,
        sourceId,
        user.id,
        'error',
        'No extracted text available or text is empty'
      );
      return new Response(
        JSON.stringify({ success: false, error: 'No extracted text available or text is empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Extracted text length:', source.extracted_text.length);
    console.log('Text preview:', source.extracted_text.substring(0, 200));

    // Update status to processing
    await updateKnowledgeSourceStatus(supabase, sourceId, user.id, 'processing');

    // Delete existing embeddings for this source
    await supabase
      .from('embeddings')
      .delete()
      .eq('source_id', sourceId)
      .eq('user_id', user.id);

    // Split text into chunks
    const chunks = splitIntoChunks(source.extracted_text);
    console.log(`Split into ${chunks.length} chunks`);

    if (chunks.length === 0) {
      await updateKnowledgeSourceStatus(
        supabase,
        sourceId,
        user.id,
        'error',
        'No content to embed'
      );
      return new Response(
        JSON.stringify({ success: false, error: 'No content to embed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate embeddings for each chunk
    const embeddingsToInsert = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length} (${chunk.tokenCount} tokens)`);

      try {
        const embedding = await generateEmbedding(chunk.text, HF_API_KEY);

        embeddingsToInsert.push({
          user_id: user.id,
          source_id: sourceId,
          chunk_index: i,
          chunk_text: chunk.text,
          token_count: chunk.tokenCount,
          embedding: `[${embedding.join(',')}]`,
          metadata: {
            source_type: source.source_type,
            source_name: source.name
          }
        });
      } catch (embedError) {
        console.error(`Error embedding chunk ${i}:`, embedError);
        const errorMessage = embedError instanceof Error ? embedError.message : 'Failed to generate embedding';
        await updateKnowledgeSourceStatus(
          supabase,
          sourceId,
          user.id,
          'error',
          `Error embedding chunk ${i + 1}/${chunks.length}: ${errorMessage}`
        );
        throw embedError;
      }
    }

    // Insert all embeddings
    const { error: insertError } = await supabase
      .from('embeddings')
      .insert(embeddingsToInsert);

    if (insertError) {
      console.error('Error inserting embeddings:', insertError);
      await updateKnowledgeSourceStatus(
        supabase,
        sourceId,
        user.id,
        'error',
        'Failed to insert embeddings into database'
      );
      throw insertError;
    }

    // Update knowledge source as completed
    await updateKnowledgeSourceStatus(
      supabase,
      sourceId,
      user.id,
      'completed',
      undefined,
      {
        ...source.metadata,
        embedding_count: chunks.length,
        embedded_at: new Date().toISOString(),
        embedding_provider: 'huggingface'
      }
    );

    console.log(`Successfully created ${chunks.length} embeddings for source ${sourceId}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chunks: chunks.length,
          totalTokens: chunks.reduce((sum, c) => sum + c.tokenCount, 0),
          provider: 'huggingface'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating embeddings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate embeddings';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
