import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function StudioRedirect() {
  const navigate = useNavigate();
  const { search } = useLocation();
  
  useEffect(() => {
    const last = localStorage.getItem("lastSiteSlug");
    navigate(last ? `/studio/${last}${search}` : `/studio/_pick${search}`, { replace: true });
  }, [navigate, search]);
  
  return null;
}