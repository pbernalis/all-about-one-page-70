-- Create index for better membership lookup performance
CREATE INDEX IF NOT EXISTS memberships_user_id_idx ON memberships(user_id);
CREATE INDEX IF NOT EXISTS memberships_site_id_idx ON memberships(site_id);

-- Create index for site slug lookups
CREATE INDEX IF NOT EXISTS sites_slug_idx ON sites(slug);