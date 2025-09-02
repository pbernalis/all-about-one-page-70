-- Fix security definer issue by simplifying the function
DROP FUNCTION IF EXISTS public.check_site_membership(text, uuid);

-- Create a helper function to check if user can edit a site (returns boolean only)
CREATE OR REPLACE FUNCTION public.user_can_edit_site(
  site_slug text,
  user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM sites s
    JOIN memberships m ON m.site_id = s.id
    WHERE s.slug = site_slug
      AND m.user_id = user_id
      AND m.role IN ('admin', 'editor')
  );
END;
$$;