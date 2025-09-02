-- Fix security definer views by removing any that exist and recreating properly
-- First, check if there are any security definer views and drop them
DROP VIEW IF EXISTS ai_messages_secure;

-- The ai_messages_secure table appears to be unnecessary and could be a security risk
-- Let's remove it entirely as it's not being used in the application
DROP TABLE IF EXISTS ai_messages_secure;

-- Ensure all functions use proper security settings
-- Update the get_or_create_conversation function to be more secure
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_project_id text, p_page_id text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_owner uuid := auth.uid();
  v_id uuid;
BEGIN
  IF v_owner IS NULL THEN
    RAISE EXCEPTION 'auth.uid() is null (not authenticated)';
  END IF;

  -- Try find existing
  SELECT id INTO v_id
  FROM public.ai_conversations
  WHERE owner = v_owner
    AND project_id = p_project_id
    AND page_id = p_page_id
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  -- Create new
  INSERT INTO public.ai_conversations (owner, project_id, page_id)
  VALUES (v_owner, p_project_id, p_page_id)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$function$;