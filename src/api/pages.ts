import { withRetry } from "@/utils/withRetry";
import { fetchWithTimeout } from "@/utils/fetchWithTimeout";

type PatchBody =
  | { mode: "schema"; schema: any; baseVersion?: number }
  | { mode: "patches"; patches: any[]; baseVersion?: number };

async function j(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Handle 412 Precondition Failed as transient (sandbox restarts)
    if (res.status === 412) {
      throw Object.assign(new Error('412'), { transient: true });
    }
    // Attach response for Retry-After header parsing and status for quick checks
    const error = Object.assign(
      new Error(data?.error ? `${res.status}: ${data.error}` : `${res.status}`),
      { response: res, status: res.status }
    );
    throw error;
  }
  return data;
}

export const pagesApi = {
  list: () => withRetry(() => fetchWithTimeout("/api/pages").then(j)),
  
  create: (slug: string, title: string) =>
    withRetry(() => fetchWithTimeout("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title }),
    }).then(j)),

  get: (id: string) => withRetry(() => fetchWithTimeout(`/api/pages/${id}`).then(j)),

  update: (id: string, body: PatchBody, etag?: string) =>
    withRetry(() => fetchWithTimeout(`/api/pages/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        ...(etag ? { "If-Match": etag } : {})
      },
      body: JSON.stringify(body),
    }).then(async (res) => {
      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        throw new Error(`version_conflict:${data?.currentVersion ?? "?"}`);
      }
      return j(res);
    })),

  publish: (id: string) =>
    withRetry(() => fetchWithTimeout(`/api/pages/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    }).then(j)),

  revert: (id: string) =>
    withRetry(() => fetchWithTimeout(`/api/pages/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revert" }),
    }).then(j)),

  duplicate: (
    id: string,
    body?: { title?: string; slug?: string; copyPublished?: boolean }
  ) =>
    withRetry(() => fetchWithTimeout(`/api/pages/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate", ...(body || {}) }),
    }).then(j)),

  rename: (id: string, body: { title?: string; slug?: string }) =>
    withRetry(() => fetchWithTimeout(`/api/pages/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename", ...body }),
    }).then(j)),

  delete: (id: string) =>
    withRetry(() => fetchWithTimeout(`/api/pages/${id}`, {
      method: "DELETE",
    }).then(j)),

  renameSlug: (id: string, slug: string) =>
    withRetry(() => fetchWithTimeout(`/api/pages/${id}/rename-slug`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).then(j)),

  publicBySlug: (slug: string) => withRetry(() => fetchWithTimeout(`/api/public/pages/${slug}`).then(j)),
};