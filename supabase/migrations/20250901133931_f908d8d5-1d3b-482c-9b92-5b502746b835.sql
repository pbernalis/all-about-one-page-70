-- Check for any existing security definer views and drop them if they exist
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Find and drop any security definer views
    FOR rec IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE definition LIKE '%SECURITY DEFINER%'
    LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(rec.schemaname) || '.' || quote_ident(rec.viewname) || ' CASCADE';
    END LOOP;
END $$;

-- Ensure our function is properly configured without security definer
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
    RETURN QUERY SELECT NULL::uuid, 'unauthorized'::text, false;
    RETURN;
  END IF;

  -- Get site ID
  SELECT s.id INTO v_site_id
  FROM sites s
  WHERE s.slug = site_slug;

  IF v_site_id IS NULL THEN
    RETURN QUERY SELECT NULL::uuid, 'site_not_found'::text, false;
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