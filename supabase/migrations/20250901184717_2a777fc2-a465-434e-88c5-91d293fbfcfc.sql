-- Fix RLS policies completely to prevent infinite recursion
-- Drop all existing policies that could cause recursion
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.memberships;
DROP POLICY IF EXISTS "Site owners can manage all memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admins can create memberships" ON public.memberships;

-- Drop site policies that reference memberships
DROP POLICY IF EXISTS "Users can view sites they are members of" ON public.sites;
DROP POLICY IF EXISTS "Only site admins can update sites" ON public.sites;
DROP POLICY IF EXISTS "Only site admins can delete sites" ON public.sites;

-- Create simple, non-recursive policies for memberships
CREATE POLICY "Users can view their own memberships" 
ON public.memberships 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own memberships" 
ON public.memberships 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Site owners can manage memberships" 
ON public.memberships 
FOR ALL
TO authenticated
USING (
  site_id IN (
    SELECT id FROM sites WHERE owner_id = auth.uid()
  )
);

-- Create simple site policies that don't reference memberships
CREATE POLICY "Users can view all sites" 
ON public.sites 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can update their owned sites" 
ON public.sites 
FOR UPDATE 
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their owned sites" 
ON public.sites 
FOR DELETE 
TO authenticated
USING (owner_id = auth.uid());