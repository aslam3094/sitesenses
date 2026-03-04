-- Create function for similarity search by source IDs
CREATE OR REPLACE FUNCTION public.match_embeddings_by_sources(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  p_source_ids UUID[] DEFAULT NULL
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
    (p_source_ids IS NULL OR e.source_id = ANY(p_source_ids))
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
