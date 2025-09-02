-- AI Chat History: Performance indexes and secure view

-- 1) Composite index for conversation + role + time (pagination & filters)
CREATE INDEX IF NOT EXISTS ai_messages_convo_role_created_idx
  ON public.ai_messages (convo_id, role, created_at);

-- 2) Partial index for assistant messages with snapshots (restore/history timelines)
CREATE INDEX IF NOT EXISTS ai_messages_assistant_snap_idx
  ON public.ai_messages (convo_id, created_at)
  WHERE role = 'assistant' AND schema_snapshot IS NOT NULL;

-- 3) GIN index for JSON patch operations (search within patch_ops)
CREATE INDEX IF NOT EXISTS ai_messages_patch_ops_gin
  ON public.ai_messages USING gin (patch_ops jsonb_path_ops);

-- 4) Optimized lookup for conversations by owner, project, page
CREATE INDEX IF NOT EXISTS ai_conversations_owner_proj_page_idx
  ON public.ai_conversations (owner, project_id, page_id);

-- 5) Secure view for simplified client queries with automatic auth filtering
CREATE OR REPLACE VIEW public.ai_messages_secure AS
SELECT m.*
FROM public.ai_messages m
JOIN public.ai_conversations c ON c.id = m.convo_id
WHERE c.owner = auth.uid();

-- Set proper ownership for the view
ALTER VIEW public.ai_messages_secure OWNER TO postgres;