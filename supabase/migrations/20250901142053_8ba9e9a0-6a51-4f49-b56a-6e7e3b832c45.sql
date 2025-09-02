-- Add unique constraint to memberships (will skip if already exists)  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'uniq_membership'
    ) THEN
        ALTER TABLE memberships ADD CONSTRAINT uniq_membership UNIQUE (user_id, site_id);
    END IF;
END $$;

-- Create preview_tokens table (without pages reference for now)
CREATE TABLE IF NOT EXISTS preview_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  page_id text,  -- using text instead of FK for now
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL
);

-- Enable RLS on preview_tokens
ALTER TABLE preview_tokens ENABLE ROW LEVEL SECURITY;

-- No direct reads from client (edge function only)
CREATE POLICY preview_tokens_read ON preview_tokens
FOR SELECT USING (false);

-- Create index for token lookups
CREATE INDEX IF NOT EXISTS preview_tokens_token_idx ON preview_tokens(token);