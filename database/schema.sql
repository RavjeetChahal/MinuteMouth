-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (anonymous device-based)
CREATE TABLE IF NOT EXISTS users (
  uuid TEXT PRIMARY KEY,
  alias TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  badges JSONB DEFAULT '[]'::jsonb
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_uuid TEXT NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
  text TEXT NOT NULL CHECK (char_length(text) <= 300),
  category TEXT NOT NULL CHECK (category IN ('dining', 'dorms', 'majors', 'professors', 'greek', 'dating', 'overheard', 'roommates', 'chaos')),
  flames INTEGER DEFAULT 0 CHECK (flames >= 0),
  super_flames INTEGER DEFAULT 0 CHECK (super_flames >= 0),
  heat_level TEXT NOT NULL DEFAULT 'mild' CHECK (heat_level IN ('mild', 'hot', 'spicy', 'chaotic', 'inferno')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  chaos_level INTEGER NOT NULL CHECK (chaos_level >= 1 AND chaos_level <= 5),
  dynamic_tags JSONB DEFAULT '{}'::jsonb
);

-- Daily prompt table
CREATE TABLE IF NOT EXISTS daily_prompt (
  date DATE PRIMARY KEY,
  prompt_id INTEGER NOT NULL REFERENCES prompts(id) ON DELETE CASCADE
);

-- Weekly awards table
CREATE TABLE IF NOT EXISTS awards_weekly (
  week_number INTEGER NOT NULL,
  category TEXT NOT NULL,
  winner_uuid TEXT NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  PRIMARY KEY (week_number, category)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_user_uuid ON posts(user_uuid);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_flames ON posts(flames DESC);
CREATE INDEX IF NOT EXISTS idx_posts_heat_level ON posts(heat_level);
CREATE INDEX IF NOT EXISTS idx_prompts_chaos_level ON prompts(chaos_level DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);

-- Function to update heat_level when flames/super_flames change
CREATE OR REPLACE FUNCTION update_heat_level()
RETURNS TRIGGER AS $$
DECLARE
  heat_score INTEGER;
  new_heat_level TEXT;
BEGIN
  heat_score := NEW.flames + (NEW.super_flames * 3);
  
  IF heat_score >= 60 THEN
    new_heat_level := 'inferno';
  ELSIF heat_score >= 31 THEN
    new_heat_level := 'chaotic';
  ELSIF heat_score >= 16 THEN
    new_heat_level := 'spicy';
  ELSIF heat_score >= 6 THEN
    new_heat_level := 'hot';
  ELSE
    new_heat_level := 'mild';
  END IF;
  
  NEW.heat_level := new_heat_level;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update heat_level
CREATE TRIGGER trigger_update_heat_level
  BEFORE INSERT OR UPDATE OF flames, super_flames ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_heat_level();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_prompt ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards_weekly ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to all tables
CREATE POLICY "Allow anonymous read on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read on posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read on prompts" ON prompts FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read on daily_prompt" ON daily_prompt FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read on awards_weekly" ON awards_weekly FOR SELECT USING (true);

-- Allow anonymous insert on users (device registration)
CREATE POLICY "Allow anonymous insert on users" ON users FOR INSERT WITH CHECK (true);

-- Allow anonymous insert on posts (anyone can post)
CREATE POLICY "Allow anonymous insert on posts" ON posts FOR INSERT WITH CHECK (true);

-- Allow anonymous update on posts (for flames/super_flames)
CREATE POLICY "Allow anonymous update on posts" ON posts FOR UPDATE USING (true);

-- Allow service role to manage prompts and daily_prompt
CREATE POLICY "Allow service role on prompts" ON prompts FOR ALL USING (true);
CREATE POLICY "Allow service role on daily_prompt" ON daily_prompt FOR ALL USING (true);
CREATE POLICY "Allow service role on awards_weekly" ON awards_weekly FOR ALL USING (true);

