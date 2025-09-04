-- Code Snippet SEO Generator Database Schema

-- Create snippets table
CREATE TABLE IF NOT EXISTS snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language VARCHAR(50),
  title TEXT,
  description TEXT,
  explanation TEXT,
  html_output TEXT,
  schema_markup JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user queries
CREATE INDEX IF NOT EXISTS snippets_user_id_idx ON snippets(user_id);
CREATE INDEX IF NOT EXISTS snippets_created_at_idx ON snippets(created_at DESC);

-- Enable RLS
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own snippets" ON snippets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own snippets" ON snippets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets" ON snippets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets" ON snippets
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_snippets_updated_at BEFORE UPDATE ON snippets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();