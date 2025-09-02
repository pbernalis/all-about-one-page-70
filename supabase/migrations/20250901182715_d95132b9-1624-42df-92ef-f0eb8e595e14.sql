-- Fix RLS policies to prevent infinite recursion on memberships table
-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Only site admins can create memberships" ON public.memberships;
DROP POLICY IF EXISTS "Only site admins can update memberships" ON public.memberships;
DROP POLICY IF EXISTS "Only site admins can delete memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users can view memberships for sites they belong to" ON public.memberships;

-- Create simpler, non-recursive policies
-- Allow authenticated users to view memberships where they are a member
CREATE POLICY "Users can view their own memberships" 
ON public.memberships 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Allow site owners and existing admins to manage memberships
CREATE POLICY "Site owners can manage all memberships" 
ON public.memberships 
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM sites s 
    WHERE s.id = memberships.site_id 
    AND s.owner_id = auth.uid()
  )
);

-- Allow existing admins to invite new members (non-recursive check)
CREATE POLICY "Admins can create memberships" 
ON public.memberships 
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sites s 
    WHERE s.id = site_id 
    AND s.owner_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM memberships m2 
    WHERE m2.site_id = site_id 
    AND m2.user_id = auth.uid() 
    AND m2.role = 'admin'
  )
);

-- Create the initial site and make pbernalis@gmail.com admin
WITH u AS (
  SELECT id FROM auth.users WHERE email = 'pbernalis@gmail.com' LIMIT 1
),
s AS (
  INSERT INTO sites (slug, name, owner_id)
  VALUES ('my-site', 'My First Site', (SELECT id FROM u))
  ON CONFLICT (slug) DO UPDATE SET owner_id = excluded.owner_id
  RETURNING id
)
INSERT INTO memberships (user_id, site_id, role)
SELECT (SELECT id FROM u), (SELECT id FROM s), 'admin'::role_enum
ON CONFLICT (user_id, site_id) DO UPDATE SET role = 'admin';