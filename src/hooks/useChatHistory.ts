import { useEffect, useState, useCallback, useRef } from 'react';
import {
  type ChatMessage,
  type Role,
  nowId,
  mergeMessages,
  loadFromStorage,
  saveToStorage,
  clearStorage,
  debounce,
  CHAT_MAX,
} from '@/cms/ai/chatHistory';
import type { RemoteAdapter } from '@/cms/ai/remote.supabase';

export type { ChatMessage };

interface UseChatHistoryOptions {
  keep?: number;
  remote?: RemoteAdapter;
  autosync?: boolean;
  linkLocalOnFirstSignIn?: boolean;
  linkMax?: number;
}

export function useChatHistory(
  projectId: string = 'default',
  pageId: string = 'default',
  options: UseChatHistoryOptions = {}
) {
  const { keep = CHAT_MAX, remote, autosync = false, linkLocalOnFirstSignIn = true, linkMax = 500 } = options;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [remoteIds, setRemoteIds] = useState<Set<string>>(new Set());
  
  // Debounced save function
  const debouncedSave = useRef(
    debounce((projectId: string, pageId: string, messages: ChatMessage[]) => {
      saveToStorage(projectId, pageId, messages, keep);
    }, 150)
  ).current;

  // Load from localStorage + optional Supabase sync
  useEffect(() => {
    const init = async () => {
      try {
        // Load local messages first
        const localMessages = loadFromStorage(projectId, pageId);
        setMessages(localMessages);
        
        // Optional remote sync
        if (remote && autosync && !synced) {
          try {
            const conversationId = await remote.getOrCreateConversation(projectId, pageId);
            const remoteMessages = await remote.listMessages(conversationId);
            
            // Track remote IDs for smart "can link now" logic
            setRemoteIds(new Set(remoteMessages.map(m => m.id)));
            
            // Merge local and remote
            const merged = mergeMessages(localMessages, remoteMessages);
            setMessages(merged);
            
            // Push local-only messages to remote (with IDs for idempotent upserts)
            const remoteMessageIds = new Set(remoteMessages.map(m => m.id));
            const onlyLocal = localMessages.filter(m => !remoteMessageIds.has(m.id));
            
            await Promise.all(
              onlyLocal.map(m =>
                remote.addMessage(
                  conversationId,
                  m.role,
                  m.content,
                  m.patchOps,
                  m.schemaSnapshot,
                  m.id // Pass existing ID for idempotent upsert
                )
              )
            );
            
            setSynced(true);
          } catch (error) {
            console.warn('Remote sync failed, using local only:', error);
          }
        }
      } catch (error) {
        console.warn('Failed to load chat history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [projectId, pageId, remote, autosync, synced, keep]);

  // Debounced save when messages change
  useEffect(() => {
    if (!loading && messages.length > 0) {
      debouncedSave(projectId, pageId, messages);
    }
  }, [messages, projectId, pageId, loading, debouncedSave]);

  // Flush to storage before page unload
  useEffect(() => {
    const onUnload = () => {
      saveToStorage(projectId, pageId, messages, keep);
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [messages, projectId, pageId, keep]);

  const addMessage = useCallback(
    async (
      role: Role,
      content: string,
      patchOps?: unknown[],
      schemaSnapshot?: unknown
    ) => {
      const newMessage: ChatMessage = {
        id: nowId(),
        role,
        content,
        timestamp: Date.now(),
        patchOps,
        schemaSnapshot,
      };

      setMessages(prev => [...prev, newMessage]);

      // Optional remote sync
      if (remote && autosync && synced) {
        try {
          const conversationId = await remote.getOrCreateConversation(projectId, pageId);
          await remote.addMessage(conversationId, role, content, patchOps, schemaSnapshot, newMessage.id);
        } catch (error) {
          console.warn('Failed to sync message to remote:', error);
        }
      }

      return newMessage.id;
    },
    [remote, autosync, synced, projectId, pageId]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    clearStorage(projectId, pageId);
  }, [projectId, pageId]);

  const getMessageById = useCallback((id: string) => {
    return messages.find(msg => msg.id === id);
  }, [messages]);

  const getUserMessages = useCallback(() => {
    return messages.filter(msg => msg.role === 'user');
  }, [messages]);

  const getAssistantMessages = useCallback(() => {
    return messages.filter(msg => msg.role === 'assistant');
  }, [messages]);

  const linkLocalToRemote = useCallback(async (targetProjectId?: string, targetPageId?: string) => {
    if (!remote || !autosync || !linkLocalOnFirstSignIn) return 0;
    
    const pid = targetProjectId || projectId;
    const pgid = targetPageId || pageId;
    
    try {
      // 1) Ensure conversation exists
      const conversationId = await remote.getOrCreateConversation(pid, pgid);
      
      // 2) Get remote messages
      const remoteMessages = await remote.listMessages(conversationId);
      
      // 3) Find local-only messages (by id)
      const remoteIds = new Set(remoteMessages.map(m => m.id));
      const localOnly = messages.filter(m => !remoteIds.has(m.id)).slice(-linkMax);
      
      // 4) Push local-only messages to remote (preserve order, with IDs for idempotent upserts)
      for (const msg of localOnly) {
        await remote.addMessage(conversationId, msg.role, msg.content, msg.patchOps, msg.schemaSnapshot, msg.id);
      }
      
      // 5) Re-fetch and merge everything
      const updatedRemoteMessages = await remote.listMessages(conversationId);
      const merged = mergeMessages(messages, updatedRemoteMessages);
      setMessages(merged);
      
      // 6) Update tracked remote IDs
      setRemoteIds(new Set(updatedRemoteMessages.map(m => m.id)));
      
      return localOnly.length;
    } catch (error) {
      console.warn('Failed to link local messages to remote:', error);
      return 0;
    }
  }, [messages, remote, autosync, linkLocalOnFirstSignIn, linkMax, projectId, pageId]);

  // Smart "can link now" computation - checks for actual local-only messages
  const canLinkNow = messages.some(m => !remoteIds.has(m.id));

  return {
    messages,
    loading,
    synced,
    addMessage,
    clearHistory,
    getMessageById,
    getUserMessages,
    getAssistantMessages,
    linkLocalToRemote,
    canLinkNow,
  };
}