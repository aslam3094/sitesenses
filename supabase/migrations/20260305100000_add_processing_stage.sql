-- Add processing_stage column to knowledge_sources for detailed progress tracking
ALTER TABLE public.knowledge_sources 
ADD COLUMN IF NOT EXISTS processing_stage TEXT DEFAULT 'pending' 
CHECK (processing_stage IN ('pending', 'scraping', 'embedding', 'completed', 'error'));

-- Update existing records to have the correct stage based on status
UPDATE public.knowledge_sources 
SET processing_stage = 'completed' 
WHERE status = 'completed' AND processing_stage = 'pending';

UPDATE public.knowledge_sources 
SET processing_stage = 'error' 
WHERE status = 'error' AND processing_stage = 'pending';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_processing_stage ON public.knowledge_sources(processing_stage);
