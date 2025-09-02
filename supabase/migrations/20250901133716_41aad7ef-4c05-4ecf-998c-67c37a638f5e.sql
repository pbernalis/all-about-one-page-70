-- Fix security definer function to be more restrictive
-- Drop and recreate the function to be safer
DROP FUNCTION IF EXISTS public.check_site_membership(text, uuid);

-- Create a safer version without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.check_site_membership(
  site_slug text,
  user_id uuid DEFAULT auth.uid()
)
RETURNS TABLE(
  site_id uuid,
  role text,
  allowed boolean
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_site_id uuid;
  v_role text;
BEGIN
  -- Only allow users to check their own membership
  IF user_id != auth.uid() AND auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'Access denied: can only check own membership';
  END IF;

  -- Get site ID
  SELECT s.id INTO v_site_id
  FROM sites s
  WHERE s.slug = site_slug;

  IF v_site_id IS NULL THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, false;
    RETURN;
  END IF;

  -- Get user role in this site (RLS will automatically filter)
  SELECT m.role INTO v_role
  FROM memberships m
  WHERE m.site_id = v_site_id AND m.user_id = COALESCE(user_id, auth.uid());

  -- Return results
  RETURN QUERY SELECT 
    v_site_id,
    COALESCE(v_role, 'none'::text),
    (v_role IN ('admin', 'editor'));
END;
$$;