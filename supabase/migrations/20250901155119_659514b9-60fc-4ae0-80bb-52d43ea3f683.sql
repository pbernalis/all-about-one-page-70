-- First, let's fix the infinite recursion in memberships policies by creating a security definer function
CREATE OR REPLACE FUNCTION public.user_has_admin_role_for_site(site_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM memberships 
    WHERE memberships.site_id = user_has_admin_role_for_site.site_id 
    AND memberships.user_id = user_has_admin_role_for_site.user_id 
    AND memberships.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Only site admins can create memberships" ON public.memberships;
DROP POLICY IF EXISTS "Only site admins can delete memberships" ON public.memberships;
DROP POLICY IF EXISTS "Only site admins can update memberships" ON public.memberships;

-- Create new policies without recursion
CREATE POLICY "Only site admins can create memberships" 
ON public.memberships 
FOR INSERT 
WITH CHECK (public.user_has_admin_role_for_site(site_id, auth.uid()));

CREATE POLICY "Only site admins can delete memberships" 
ON public.memberships 
FOR DELETE 
USING (public.user_has_admin_role_for_site(site_id, auth.uid()));

CREATE POLICY "Only site admins can update memberships" 
ON public.memberships 
FOR UPDATE 
USING (public.user_has_admin_role_for_site(site_id, auth.uid()));

-- Now let's get the user ID for pbernalis@gmail.com and create a site if needed
-- First, let's see if we have any sites
DO $$
DECLARE
    user_uuid uuid;
    site_uuid uuid;
BEGIN
    -- Get the user ID for pbernalis@gmail.com
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'pbernalis@gmail.com';
    
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User pbernalis@gmail.com not found';
    END IF;
    
    -- Check if we have any sites, if not create a default one
    SELECT id INTO site_uuid FROM sites LIMIT 1;
    
    IF site_uuid IS NULL THEN
        -- Create a default site
        INSERT INTO sites (name, slug, owner_id)
        VALUES ('Default Site', 'default', user_uuid)
        RETURNING id INTO site_uuid;
    END IF;
    
    -- Make the user an admin of the site (insert or update)
    INSERT INTO memberships (user_id, site_id, role)
    VALUES (user_uuid, site_uuid, 'admin')
    ON CONFLICT (user_id, site_id) 
    DO UPDATE SET role = 'admin', updated_at = now();
    
    RAISE NOTICE 'Made user % admin of site %', user_uuid, site_uuid;
END $$;