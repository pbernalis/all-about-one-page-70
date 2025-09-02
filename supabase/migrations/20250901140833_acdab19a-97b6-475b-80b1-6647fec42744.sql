-- Create enum for membership roles
CREATE TYPE role_enum AS ENUM ('admin', 'editor', 'viewer');

-- Create sites table
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memberships table
CREATE TABLE public.memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  role role_enum NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, site_id)
);

-- Enable RLS
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX memberships_user_id_idx ON memberships(user_id);
CREATE INDEX memberships_site_id_idx ON memberships(site_id);
CREATE INDEX sites_slug_idx ON sites(slug);

-- RLS Policies for sites
CREATE POLICY "Users can view sites they are members of" 
ON public.sites 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM memberships 
    WHERE memberships.site_id = sites.id 
    AND memberships.user_id = auth.uid()
  )
);

CREATE POLICY "Only admins can create sites"
ON public.sites
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Only site admins can update sites"
ON public.sites
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM memberships 
    WHERE memberships.site_id = sites.id 
    AND memberships.user_id = auth.uid()
    AND memberships.role = 'admin'
  )
);

CREATE POLICY "Only site admins can delete sites"
ON public.sites
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM memberships 
    WHERE memberships.site_id = sites.id 
    AND memberships.user_id = auth.uid()
    AND memberships.role = 'admin'
  )
);

-- RLS Policies for memberships
CREATE POLICY "Users can view memberships for sites they belong to"
ON public.memberships
FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM memberships m2
    WHERE m2.site_id = memberships.site_id 
    AND m2.user_id = auth.uid()
  )
);

CREATE POLICY "Only site admins can create memberships"
ON public.memberships
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM memberships 
    WHERE memberships.site_id = site_id 
    AND memberships.user_id = auth.uid()
    AND memberships.role = 'admin'
  )
);

CREATE POLICY "Only site admins can update memberships"
ON public.memberships
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM memberships m2
    WHERE m2.site_id = memberships.site_id 
    AND m2.user_id = auth.uid()
    AND m2.role = 'admin'
  )
);

CREATE POLICY "Only site admins can delete memberships"
ON public.memberships
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM memberships m2
    WHERE m2.site_id = memberships.site_id 
    AND m2.user_id = auth.uid()
    AND m2.role = 'admin'
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_sites_updated_at
BEFORE UPDATE ON public.sites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at
BEFORE UPDATE ON public.memberships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a default site for testing (only if authenticated)
INSERT INTO sites (slug, name, owner_id) 
SELECT 'default', 'Default Site', auth.uid()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

-- Add current user as admin of the default site (if authenticated)
INSERT INTO memberships (user_id, site_id, role)
SELECT auth.uid(), s.id, 'admin'::role_enum
FROM sites s 
WHERE s.slug = 'default' 
  AND auth.uid() IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM memberships m 
    WHERE m.user_id = auth.uid() 
    AND m.site_id = s.id
  );