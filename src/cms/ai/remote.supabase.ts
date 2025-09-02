// -----------------------------------------------------------------------------
// FILE: src/cms/ai/remote.supabase.ts  
// Supabase adapter for chat history sync with performance optimizations
// -----------------------------------------------------------------------------

import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage, Role } from "./chatHistory";

export interface RemoteAdapter {
  getOrCreateConversation(projectId: string, pageId: string): Promise<string>
  listMessages(conversationId: string): Promise<ChatMessage[]>
  addMessage(
    conversationId: string,
    role: Role,
    content: string,
    patchOps?: unknown[],
    schemaSnapshot?: unknown,
    messageId?: string
  ): Promise<string>
}

export const supabaseRemote: RemoteAdapter = {
  async getOrCreateConversation(projectId: string, pageId: string): Promise<string> {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('Not authenticated');

    const { data, error } = await supabase.rpc('get_or_create_conversation', {
      p_project_id: projectId,
      p_page_id: pageId,
    });
    
    if (error) throw error;
    return data as string;
  },

  async listMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('id, role, text, patch_ops, schema_snapshot, created_at')
      .eq('convo_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data ?? []).map(r => ({
      id: r.id,
      role: r.role as Role,
      content: r.text,
      patchOps: (r.patch_ops as unknown[]) ?? undefined,
      schemaSnapshot: r.schema_snapshot ?? undefined,
      timestamp: Date.parse(r.created_at),
    }));
  },

  async addMessage(
    conversationId: string,
    role: Role,
    content: string,
    patchOps?: unknown[],
    schemaSnapshot?: unknown,
    messageId?: string
  ): Promise<string> {
    // Safe JSON serialization with size limits
    function safeJson(obj: unknown, maxSize = 200_000) {
      const serialized = JSON.stringify(obj);
      return serialized.length > maxSize 
        ? JSON.stringify({ truncated: true, originalSize: serialized.length })
        : JSON.parse(serialized);
    }

    const payload = {
      id: messageId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      convo_id: conversationId,
      role,
      text: content,
      patch_ops: patchOps ? safeJson(patchOps) : null,
      schema_snapshot: schemaSnapshot ? safeJson(schemaSnapshot) : null,
    };

    const { data, error } = await supabase
      .from('ai_messages')
      .upsert(payload, { onConflict: 'id', ignoreDuplicates: true })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },
};