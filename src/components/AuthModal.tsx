import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MobileDrawer } from '@/components/MobileDrawer';
import { GoogleIcon } from '@/components/GoogleIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
}

export const AuthModal = ({ open, onOpenChange, onAuthSuccess }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleModalClose = (open: boolean) => {
    onOpenChange(open);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Oneira!",
          description: "You have successfully signed in with Google.",
        });
        handleModalClose(false);
        onAuthSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <MobileDrawer
      open={open}
      onOpenChange={handleModalClose}
      title="Welcome to Oneira"
      description="Continue with Google to start your dream journey"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
            variant="outline"
          >
            <GoogleIcon className="w-5 h-5 mr-3" />
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>
        </div>

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