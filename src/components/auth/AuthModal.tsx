import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Github, Chrome, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signInWithMagicLink, signInWithProvider, signInWithPassword, signUp, resetPassword, resendConfirmation } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleMagicLink = async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      await signInWithMagicLink(email);
      setSent(true);
    } catch (error) {
      console.error('Magic link error:', error);
      setError('Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const result = isSignUp 
        ? await signUp(email, password)
        : await signInWithPassword(email, password);
      
      if (result.error) {
        setError(result.error);
      } else if (isSignUp) {
        setSent(true);
      } else {
        handleClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error('OAuth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const result = await resetPassword(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSent(true);
        setShowPasswordReset(false);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const result = await resendConfirmation(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSent(true);
      }
    } catch (error) {
      console.error('Resend confirmation error:', error);
      setError('Failed to resend confirmation email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setIsSignUp(false);
    setSent(false);
    setLoading(false);
    setError('');
    setShowPasswordReset(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Mail className="h-4 w-4 text-white" />
            </div>
            Sign in to sync your chats
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!sent ? (
            <>
              {!showPasswordReset && (
                <>
                  {/* Toggle between Sign In and Sign Up */}
                  <div className="flex rounded-lg bg-muted p-1">
                    <button
                      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        !isSignUp ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setIsSignUp(false)}
                      disabled={loading}
                    >
                      Sign In
                    </button>
                    <button
                      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isSignUp ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setIsSignUp(true)}
                      disabled={loading}
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              {showPasswordReset && (
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Reset Password</h3>
                  <p className="text-sm text-muted-foreground">Enter your email to receive a password reset link</p>
                </div>
              )}

              {/* Email/Password Form */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
                
                {!showPasswordReset && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                  </div>
                )}
                
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                    {error}
                    {error.includes('Invalid login credentials') && (
                      <div className="mt-2 space-y-1">
                        <button
                          className="text-xs text-primary underline block"
                          onClick={() => setShowPasswordReset(true)}
                          disabled={loading}
                        >
                          Reset password
                        </button>
                        <button
                          className="text-xs text-primary underline block"
                          onClick={handleResendConfirmation}
                          disabled={loading || !email.trim()}
                        >
                          Resend confirmation email
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!showPasswordReset ? (
                  <Button 
                    onClick={handlePasswordAuth}
                    disabled={loading || !email.trim() || !password.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {isSignUp ? 'Creating account...' : 'Signing in...'}
                      </>
                    ) : (
                      isSignUp ? 'Create account' : 'Sign in'
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={handlePasswordReset}
                      disabled={loading || !email.trim()}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Sending reset email...
                        </>
                      ) : (
                        'Send reset email'
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowPasswordReset(false)}
                      disabled={loading}
                      className="w-full"
                    >
                      Back to sign in
                    </Button>
                  </div>
                )}

                {!showPasswordReset && !isSignUp && (
                  <div className="text-center">
                    <button
                      className="text-sm text-primary underline"
                      onClick={() => setShowPasswordReset(true)}
                      disabled={loading}
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </div>

              {!showPasswordReset && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  {/* Magic Link Option */}
                  <Button 
                    variant="outline"
                    onClick={handleMagicLink}
                    disabled={loading || !email.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending magic link...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send magic link instead
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  {/* OAuth Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleOAuth('google')}
                      disabled={loading}
                      className="w-full"
                    >
                      <Chrome className="h-4 w-4 mr-2" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOAuth('github')}
                      disabled={loading}
                      className="w-full"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </>
              )}

              {/* Continue as guest hint */}
              <div className="mt-4 rounded-md border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
                Prefer not to sign in now? You can{' '}
                <button
                  className="underline hover:text-foreground"
                  onClick={handleClose}
                  title="Continue without an account"
                >
                  continue as guest
                </button>
                . Your chat history will be saved locally on this device and can be linked to your account later.
              </div>
            </>
          ) : (
            <div className="space-y-3 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Check your email</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isSignUp 
                    ? `We sent a confirmation link to ${email}. Click it to activate your account.`
                    : `We sent a sign-in link to ${email}`
                  }
                </p>
              </div>
              <Button variant="outline" onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}