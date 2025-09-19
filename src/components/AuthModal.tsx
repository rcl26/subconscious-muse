import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileDrawer } from '@/components/MobileDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export const AuthModal = ({ open, onOpenChange, onAuthSuccess }: AuthModalProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  
  // Separate form states
  const [signinForm, setSigninForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ email: "", password: "" });
  const [forgotPasswordForm, setForgotPasswordForm] = useState({ email: "" });
  
  const { signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const { toast } = useToast();

  const resetAllForms = () => {
    setSigninForm({ email: "", password: "" });
    setSignupForm({ email: "", password: "" });
    setForgotPasswordForm({ email: "" });
    setAuthMode('signin');
  };

  const handleModalClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetAllForms();
    }
  };

  const handleSignIn = async () => {
    if (!signinForm.email || !signinForm.password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signInWithEmail(signinForm.email, signinForm.password);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      handleModalClose(false);
      onAuthSuccess?.();
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    if (!signupForm.email || !signupForm.password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUpWithEmail(signupForm.email, signupForm.password);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email!",
        description: "We've sent you a confirmation link to complete your registration.",
        duration: Infinity,
      });
      handleModalClose(false);
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordForm.email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(forgotPasswordForm.email);
    
    if (error) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email!",
        description: "We've sent you a password reset link.",
        duration: Infinity,
      });
      setAuthMode('signin');
      setForgotPasswordForm({ email: "" });
    }
    setIsLoading(false);
  };

  const getTitle = () => {
    switch (authMode) {
      case 'signin': return "Welcome to Oneira";
      case 'signup': return "Welcome to Oneira";
      case 'forgot-password': return "Reset your password";
      default: return "Welcome to Oneira";
    }
  };

  const getDescription = () => {
    switch (authMode) {
      case 'signin': return "Sign in to start recording and analyzing your dreams";
      case 'signup': return "Create an account to start recording and analyzing your dreams";
      case 'forgot-password': return "Enter your email to receive a password reset link";
      default: return "Sign in to start recording and analyzing your dreams";
    }
  };

  return (
    <MobileDrawer
      open={open}
      onOpenChange={handleModalClose}
      title={getTitle()}
      description={getDescription()}
    >
      <div className="space-y-6">
        {authMode === 'forgot-password' ? (
          // Forgot Password Form
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email address"
                value={forgotPasswordForm.email}
                onChange={(e) => setForgotPasswordForm({ email: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Sending reset link..." : "Send reset link"}
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setAuthMode('signin')}
              disabled={isLoading}
              className="w-full"
            >
              Back to sign in
            </Button>
          </div>
        ) : (
          // Sign In / Sign Up Tabs
          <Tabs 
            value={authMode} 
            onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signinForm.email}
                  onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signinForm.password}
                  onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot-password')}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Forgot password?
                </button>
              </div>
              <Button 
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </TabsContent>
          </Tabs>
        )}

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:text-foreground">terms of service</a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-foreground">privacy policy</a>
        </p>
      </div>
    </MobileDrawer>
  );
};