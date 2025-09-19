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
  const [authMode, setAuthMode] = useState<'email' | 'reset'>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<'email' | null>(null);

  const { signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const { toast } = useToast();

  const resetState = () => {
    setAuthMode('email');
    setIsSignUp(false);
    setEmail('');
    setResetEmail('');
    setPassword('');
    setIsLoading(false);
    setLoadingMethod(null);
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
        setAuthMode('email');
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
          onClick={() => setAuthMode('email')}
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


  const renderEmailForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isSignUp ? 'Start your dream journey' : 'Continue your dream journey'}
        </p>
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
      title="Welcome to Oneira"
      description="Sign in to start recording and analyzing your dreams"
    >
      {authMode === 'email' ? renderEmailForm() : renderPasswordReset()}
    </MobileDrawer>
  );
};