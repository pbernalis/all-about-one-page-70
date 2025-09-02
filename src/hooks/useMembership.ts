import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type MembershipRole = 'admin' | 'editor' | 'viewer';

export function useMembership(siteSlug?: string) {
  const { user } = useAuth();
  const [role, setRole] = useState<MembershipRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [siteId, setSiteId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const checkMembership = async () => {
      if (!siteSlug || !user) {
        setLoading(false);
        setAllowed(false);
        return;
      }

      setLoading(true);
      
      try {
        // First, get the site by slug
        const { data: site, error: siteError } = await supabase
          .from('sites')
          .select('id')
          .eq('slug', siteSlug)
          .maybeSingle();

        if (siteError) {
          console.error('Site lookup error:', siteError);
          setAllowed(false);
          setRole(null);
          setSiteId(null);
          return;
        }

        if (!site?.id) {
          setAllowed(false);
          setRole(null);
          setSiteId(null);
          return;
        }

        setSiteId(site.id);

        // Then check user's membership for this site
        const { data: membership, error: membershipError } = await supabase
          .from('memberships')
          .select('role')
          .eq('site_id', site.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (membershipError) {
          console.error('Membership check error:', membershipError);
          setAllowed(false);
          setRole(null);
          return;
        }

        const userRole = membership?.role as MembershipRole;
        setRole(userRole || null);
        
        // Allow access for admin and editor roles
        const canEdit = userRole === 'admin' || userRole === 'editor';
        setAllowed(canEdit);
        
      } catch (error) {
        console.error('Membership check failed:', error);
        if (!cancelled) {
          setAllowed(false);
          setRole(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkMembership();
    return () => { cancelled = true; };
  }, [siteSlug, user]);

  return { loading, allowed, role, siteId };
}