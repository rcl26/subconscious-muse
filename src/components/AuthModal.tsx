import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileDrawer } from '@/components/MobileDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
}

export const AuthModal = ({ open, onOpenChange, onAuthSuccess }: AuthModalProps) => {
  const [authMode, setAuthMode] = useState<'main' | 'email' | 'reset'>('main');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<'google' | 'email' | null>(null);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const { toast } = useToast();

  const resetState = () => {
    setAuthMode('main');
    setIsSignUp(false);
    setEmail('');
    setResetEmail('');
    setPassword('');
    setIsLoading(false);
    setLoadingMethod(null);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoadingMethod('google');
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Successfully signed in with Google",
        });
        onAuthSuccess?.();
        onOpenChange(false);
        resetState();
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingMethod('email');
    
    try {
      const { error } = isSignUp 
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);
      
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const message = isSignUp 
          ? "Account created! Please check your email to verify your account."
          : "Successfully signed in!";
        
        toast({
          title: "Success!",
          description: message,
        });
        
        if (!isSignUp) {
          onAuthSuccess?.();
          onOpenChange(false);
          resetState();
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingMethod('email');
    
    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        toast({
          title: "Reset Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Email Sent!",
          description: "Check your email for password reset instructions.",
        });
        setAuthMode('main');
        setResetEmail('');
      }
    } catch (error: any) {
      toast({
        title: "Reset Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  };

  const renderPasswordReset = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Button
          onClick={() => setAuthMode('main')}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Reset Password</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-base"
        >
          {loadingMethod === 'email' ? 'Sending...' : 'Send Reset Instructions'}
        </Button>
      </form>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={() => setAuthMode('email')}
          disabled={isLoading}
        >
          Back to sign in
        </Button>
      </div>
    </div>
  );

  const renderMainOptions = () => (
    <div className="space-y-4">
      <Button 
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full h-12 text-base"
        variant="outline"
      >
        {loadingMethod === 'google' ? (
          "Signing in..."
        ) : (
          <>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </>
        )}
      </Button>
      
      <Button 
        onClick={() => setAuthMode('email')}
        disabled={isLoading}
        className="w-full h-12 text-base"
        variant="outline"
      >
        <Mail className="w-5 h-5 mr-3" />
        Continue with Email
      </Button>
    </div>
  );

  const renderEmailForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Button
          onClick={() => setAuthMode('main')}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h3>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-base"
        >
          {loadingMethod === 'email' ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>
      </form>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          disabled={isLoading}
        >
          {isSignUp 
            ? 'Already have an account? Sign in' 
            : "Don't have an account? Create one"
          }
        </Button>
        
        {!isSignUp && (
          <Button
            type="button"
            variant="link"
            onClick={() => setAuthMode('reset')}
            disabled={isLoading}
            className="block mx-auto"
          >
            Forgot your password?
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <MobileDrawer
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetState();
      }}
      title={authMode === 'main' ? 'Welcome to DreamScape' : ''}
      description={authMode === 'main' ? 'Sign in to start recording and analyzing your dreams' : undefined}
    >
      {authMode === 'main' ? renderMainOptions() : authMode === 'email' ? renderEmailForm() : renderPasswordReset()}
    </MobileDrawer>
  );
};