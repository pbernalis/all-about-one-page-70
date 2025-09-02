import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session) return;
      const params = new URLSearchParams(search);
      const next = params.get("next");
      const last = localStorage.getItem("lastSiteSlug");
      navigate(next || (last ? `/studio/${last}` : `/studio/_pick`), { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate, search]);

  return (
    <div className="min-h-screen bg-gradient-canvas grid place-items-center">
      <AuthModal open={open} onClose={() => navigate("/")} />
    </div>
  );
}