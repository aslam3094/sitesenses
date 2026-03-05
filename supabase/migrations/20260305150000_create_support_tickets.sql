CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  issue TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create tickets (for contact form)
CREATE POLICY "Anyone can create support tickets" 
  ON support_tickets 
  FOR INSERT 
  TO PUBLIC 
  WITH CHECK (true);

-- Only authenticated users can view their own tickets
CREATE POLICY "Users can view their own tickets" 
  ON support_tickets 
  FOR SELECT 
  TO authenticated 
  USING (user_email = auth.jwt() ->> 'email');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_tickets_updated_at 
  BEFORE UPDATE ON support_tickets 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
