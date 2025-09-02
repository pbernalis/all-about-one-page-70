import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function InviteMembersModal({
  siteId,
  open,
  onClose,
}: { siteId: string; open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin"|"editor"|"viewer">("editor");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!open) return null;

  const submit = async () => {
    if (!email) return;
    setLoading(true);
    setMsg(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("https://vutoglthnjuhgayyatzu.supabase.co/functions/v1/invite_member", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ site_id: siteId, email, role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Invite failed");

      setMsg("Invite sent and membership added ✅");
      setEmail("");
    } catch (e: any) {
      setMsg(e.message ?? "Invite failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border bg-background p-4 shadow-2xl">
        <div className="mb-3 text-lg font-semibold">Invite a member</div>

        <label className="block text-sm mb-1">Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="user@company.com"
          className="mb-3 w-full rounded-md border px-3 py-2"
        />

        <label className="block text-sm mb-1">Role</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value as any)}
          className="mb-4 w-full rounded-md border px-3 py-2"
        >
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>

        {msg && <div className="mb-3 text-sm opacity-70">{msg}</div>}

        <div className="flex justify-end gap-2">
          <button className="rounded-md border px-3 py-1.5" onClick={onClose}>Close</button>
          <button
            className="rounded-md border px-3 py-1.5"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Sending…" : "Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}