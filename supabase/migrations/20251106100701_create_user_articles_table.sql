/*
  # Create User Articles Table

  1. New Tables
    - `user_articles`
      - `id` (uuid, primary key)
      - `title` (text, required) - Article title
      - `summary` (text, required) - Short description/summary
      - `content` (text, required) - Full article content
      - `image_url` (text, required) - Article image URL
      - `category` (text, required) - Article category (breaking, politics, india, world, business, technology, sports, entertainment, health)
      - `source` (text) - News source
      - `author` (text, required) - Article author
      - `author_id` (text) - User ID of author (from AuthContext)
      - `language` (text) - Language code (en, hi, or, etc.)
      - `tags` (text array) - Article tags
      - `is_premium` (boolean) - Premium content flag
      - `read_time` (integer) - Estimated read time in minutes
      - `published_at` (timestamptz) - Publication timestamp
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `is_verified` (boolean) - Fake news verification status
      - `verification_score` (numeric) - AI verification confidence score

  2. Security
    - Enable RLS on `user_articles` table
    - Policy: Anyone can read published articles
    - Policy: Authenticated users can create articles
    - Policy: Authors can update/delete their own articles

  3. Indexes
    - Index on category for fast filtering
    - Index on published_at for chronological sorting
    - Index on author_id for user-specific queries
    - Full-text search index on title and content
*/

-- Create user_articles table
CREATE TABLE IF NOT EXISTS user_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('breaking', 'politics', 'india', 'world', 'business', 'technology', 'sports', 'entertainment', 'health')),
  source text DEFAULT 'Cambliss Community',
  author text NOT NULL,
  author_id text,
  language text DEFAULT 'en',
  tags text[] DEFAULT '{}',
  is_premium boolean DEFAULT false,
  read_time integer DEFAULT 5,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_verified boolean DEFAULT false,
  verification_score numeric(3,2) DEFAULT 0.00
);

-- Enable Row Level Security
ALTER TABLE user_articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Anyone can read published articles"
  ON user_articles
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can create articles
CREATE POLICY "Authenticated users can create articles"
  ON user_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authors can update their own articles
CREATE POLICY "Authors can update own articles"
  ON user_articles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = author_id)
  WITH CHECK (auth.uid()::text = author_id);

-- Policy: Authors can delete their own articles
CREATE POLICY "Authors can delete own articles"
  ON user_articles
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = author_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_articles_category ON user_articles(category);
CREATE INDEX IF NOT EXISTS idx_user_articles_published_at ON user_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_articles_author_id ON user_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_user_articles_language ON user_articles(language);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_user_articles_search ON user_articles USING gin(to_tsvector('english', title || ' ' || content));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_articles_updated_at ON user_articles;
CREATE TRIGGER update_user_articles_updated_at
  BEFORE UPDATE ON user_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
