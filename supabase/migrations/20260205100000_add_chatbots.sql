-- Create chatbots table
CREATE TABLE public.chatbots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  widget_color TEXT DEFAULT '#000000',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chatbot_sources junction table (many-to-many)
CREATE TABLE public.chatbot_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(chatbot_id, source_id)
);

-- Create chatbot_messages table for chat history per chatbot
CREATE TABLE public.chatbot_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  token_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chatbot_stats table for usage tracking
CREATE TABLE public.chatbot_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chatbot_id UUID NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(chatbot_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chatbots
CREATE POLICY "Users can view their own chatbots" 
  ON public.chatbots FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chatbots" 
  ON public.chatbots FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbots" 
  ON public.chatbots FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chatbots" 
  ON public.chatbots FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for chatbot_sources
CREATE POLICY "Users can view chatbot sources" 
  ON public.chatbot_sources FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM public.chatbots WHERE id = chatbot_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can manage chatbot sources" 
  ON public.chatbot_sources FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.chatbots WHERE id = chatbot_id AND user_id = auth.uid())
  );

-- RLS Policies for chatbot_messages
CREATE POLICY "Users can view chatbot messages" 
  ON public.chatbot_messages FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chatbot messages" 
  ON public.chatbot_messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete chatbot messages" 
  ON public.chatbot_messages FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for chatbot_stats
CREATE POLICY "Users can view chatbot stats" 
  ON public.chatbot_stats FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM public.chatbots WHERE id = chatbot_id AND user_id = auth.uid())
  );

-- Create indexes
CREATE INDEX idx_chatbot_sources_chatbot_id ON public.chatbot_sources(chatbot_id);
CREATE INDEX idx_chatbot_messages_chatbot_id ON public.chatbot_messages(chatbot_id);
CREATE INDEX idx_chatbot_messages_created_at ON public.chatbot_messages(created_at DESC);
CREATE INDEX idx_chatbot_stats_chatbot_id ON public.chatbot_stats(chatbot_id);
CREATE INDEX idx_chatbot_stats_date ON public.chatbot_stats(date);

-- Add chatbot_id to existing knowledge_sources (optional migration - making it nullable for now)
-- This allows sources to be either user-level or chatbot-specific
ALTER TABLE public.knowledge_sources ADD COLUMN IF NOT EXISTS chatbot_id UUID REFERENCES public.chatbots(id) ON DELETE SET NULL;

-- Add unique constraint for max 3 chatbots per user
CREATE OR REPLACE FUNCTION check_max_chatbots()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.chatbots WHERE user_id = NEW.user_id) >= 3 THEN
    RAISE EXCEPTION 'Maximum of 3 chatbots allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER max_chatbots_trigger
BEFORE INSERT ON public.chatbots
FOR EACH ROW
EXECUTE FUNCTION check_max_chatbots();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_chatbot_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chatbots_updated_at
BEFORE UPDATE ON public.chatbots
FOR EACH ROW
EXECUTE FUNCTION public.update_chatbot_updated_at_column();
