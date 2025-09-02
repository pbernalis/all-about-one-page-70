import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically handles the auth tokens from the URL
    // Give it a moment to process, then redirect
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-foreground">Signing you in...</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait while we complete the authentication process.
          </p>
        </div>
      </div>
    </div>
  );
}