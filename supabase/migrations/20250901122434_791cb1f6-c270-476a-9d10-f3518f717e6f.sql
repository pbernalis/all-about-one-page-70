-- AI Chat History: Complete setup with tables, RLS, functions, and performance indexes

-- 1) Create the base tables
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  page_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner, project_id, page_id)
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convo_id uuid NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  text text NOT NULL,
  patch_ops jsonb,
  schema_snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Enable RLS
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- 3) RLS policies for conversations
CREATE POLICY "conversations_select" ON public.ai_conversations
  FOR SELECT USING (auth.uid() = owner);

CREATE POLICY "conversations_insert" ON public.ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = owner);

CREATE POLICY "conversations_update" ON public.ai_conversations
  FOR UPDATE USING (auth.uid() = owner) WITH CHECK (auth.uid() = owner);

CREATE POLICY "conversations_delete" ON public.ai_conversations
  FOR DELETE USING (auth.uid() = owner);

-- 4) RLS policies for messages
CREATE POLICY "messages_select" ON public.ai_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ai_conversations c
      WHERE c.id = ai_messages.convo_id AND c.owner = auth.uid()
    )
  );

CREATE POLICY "messages_insert" ON public.ai_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_conversations c
      WHERE c.id = ai_messages.convo_id AND c.owner = auth.uid()
    )
  );

-- 5) Performance indexes
CREATE INDEX IF NOT EXISTS ai_conversations_owner_idx 
  ON public.ai_conversations(owner);

CREATE INDEX IF NOT EXISTS ai_conversations_lookup_idx 
  ON public.ai_conversations(owner, project_id, page_id);

CREATE INDEX IF NOT EXISTS ai_messages_convo_idx 
  ON public.ai_messages(convo_id, created_at);

CREATE INDEX IF NOT EXISTS ai_messages_convo_role_created_idx
  ON public.ai_messages(convo_id, role, created_at);

CREATE INDEX IF NOT EXISTS ai_messages_assistant_snap_idx
  ON public.ai_messages(convo_id, created_at)
  WHERE role = 'assistant' AND schema_snapshot IS NOT NULL;

CREATE INDEX IF NOT EXISTS ai_messages_patch_ops_gin
  ON public.ai_messages USING gin (patch_ops jsonb_path_ops);

-- 6) RPC function for get-or-create conversation
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(p_project_id text, p_page_id text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
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

-- 7) Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_or_create_conversation(text, text) TO anon, authenticated;

-- 8) Secure view for simplified queries
CREATE OR REPLACE VIEW public.ai_messages_secure AS
SELECT m.*
FROM public.ai_messages m
JOIN public.ai_conversations c ON c.id = m.convo_id
WHERE c.owner = auth.uid();

ALTER VIEW public.ai_messages_secure OWNER TO postgres;