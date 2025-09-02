-- Fix security linter issues from AI chat history setup

-- 1) Fix the security definer view by recreating it without SECURITY DEFINER
DROP VIEW IF EXISTS public.ai_messages_secure;

CREATE VIEW public.ai_messages_secure AS
SELECT m.*
FROM public.ai_messages m
JOIN public.ai_conversations c ON c.id = m.convo_id
WHERE c.owner = auth.uid();

-- Note: No SECURITY DEFINER - relies on RLS policies instead

-- 2) Fix function search path by setting it explicitly  
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_project_id text, p_page_id text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;