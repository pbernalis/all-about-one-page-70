import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

export default function AuthButton() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{user.email}</span>
        <button className="text-sm underline hover:text-foreground" onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <button className="text-sm underline hover:text-foreground" onClick={() => setOpen(true)}>
        Sign in
      </button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}