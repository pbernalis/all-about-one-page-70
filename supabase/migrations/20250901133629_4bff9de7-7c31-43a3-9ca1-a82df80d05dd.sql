-- Create RPC function to check site membership
CREATE OR REPLACE FUNCTION public.check_site_membership(
  site_slug text,
  user_id uuid
)
RETURNS TABLE(
  site_id uuid,
  role text,
  allowed boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_site_id uuid;
  v_role text;
BEGIN
  -- Get site ID
  SELECT s.id INTO v_site_id
  FROM sites s
  WHERE s.slug = site_slug;

  IF v_site_id IS NULL THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, false;
    RETURN;
  END IF;

  -- Get user role in this site
  SELECT m.role INTO v_role
  FROM memberships m
  WHERE m.site_id = v_site_id AND m.user_id = user_id;

  -- Return results
  RETURN QUERY SELECT 
    v_site_id,
    v_role,
    (v_role IN ('admin', 'editor'));
END;
$$;