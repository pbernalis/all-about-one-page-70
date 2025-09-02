// -----------------------------------------------------------------------------
// FILE: src/cms/ai/chatHistory.ts
// Utilities for chat history persistence (ids, sort, merge, debounce, storage)
// -----------------------------------------------------------------------------

export type Role = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  id: string
  role: Role
  content: string
  timestamp: number // unix ms
  patchOps?: unknown[]
  schemaSnapshot?: unknown
}

export const CHAT_VERSION = 'v1'
export const CHAT_MAX = 200

export const chatKey = (projectId: string, pageId: string) =>
  `studio:${CHAT_VERSION}:chat:${projectId}:${pageId}`

export function nowId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function stableSortByTs<T extends { timestamp: number }>(arr: T[]) {
  return [...arr].sort((a, b) => a.timestamp - b.timestamp)
}

export function dedupeById<T extends { id: string }>(arr: T[]) {
  const seen = new Set<string>()
  const out: T[] = []
  for (const it of arr) if (!seen.has(it.id)) { seen.add(it.id); out.push(it) }
  return out
}

export function mergeMessages(local: ChatMessage[], remote: ChatMessage[]) {
  return stableSortByTs(dedupeById([...local, ...remote]))
}

export function loadFromStorage(projectId: string, pageId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(chatKey(projectId, pageId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export function saveToStorage(projectId: string, pageId: string, messages: ChatMessage[], keep = CHAT_MAX) {
  try {
    const pruned = messages.slice(-keep)
    localStorage.setItem(chatKey(projectId, pageId), JSON.stringify(pruned))
  } catch {}
}

export function clearStorage(projectId: string, pageId: string) {
  try { localStorage.removeItem(chatKey(projectId, pageId)) } catch {}
}

export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 120) {
  let t: number | undefined
  return (...args: Parameters<T>) => {
    if (t) window.clearTimeout(t)
    t = window.setTimeout(() => fn(...args), ms)
  }
}