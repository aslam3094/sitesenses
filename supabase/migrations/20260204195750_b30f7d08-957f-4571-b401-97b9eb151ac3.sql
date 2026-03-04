-- Enable pgvector extension in public schema (must be applied first)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table
CREATE TABLE public.embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_id UUID NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  token_count INTEGER NOT NULL,
  embedding vector(1536) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for vector similarity search
CREATE INDEX embeddings_embedding_idx ON public.embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for user queries
CREATE INDEX embeddings_user_id_idx ON public.embeddings(user_id);
CREATE INDEX embeddings_source_id_idx ON public.embeddings(source_id);

-- Enable Row Level Security
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own embeddings" 
ON public.embeddings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own embeddings" 
ON public.embeddings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own embeddings" 
ON public.embeddings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION public.match_embeddings(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  source_id UUID,
  chunk_text TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.source_id,
    e.chunk_text,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM public.embeddings e
  WHERE 
    (p_user_id IS NULL OR e.user_id = p_user_id)
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;