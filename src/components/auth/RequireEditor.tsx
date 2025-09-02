import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/hooks/useMembership';
import AuthModal from './AuthModal';
import { useState } from 'react';

export default function RequireEditor({ children }: { children: React.JSX.Element }) {
  const { user, loading: authLoading } = useAuth();
  const { siteSlug } = useParams();
  const membershipEnabled = !!siteSlug;
  const { loading: membershipLoading, allowed } = useMembership(siteSlug);
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading while checking auth
  if (authLoading || (membershipEnabled && membershipLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto p-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Studio Access Required</h1>
              <p className="text-muted-foreground">
                You need to sign in to access the Studio builder.
              </p>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  // If no site slug, skip membership check and allow authenticated users
  if (!membershipEnabled) {
    return children;
  }

  // Show access denied if not allowed
  if (!allowed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🔒</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this Studio. Contact your site administrator to request access.
            </p>
          </div>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
}