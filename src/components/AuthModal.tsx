import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MobileDrawer } from '@/components/MobileDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FcGoogle } from 'react-icons/fc';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
}

export const AuthModal = ({ open, onOpenChange, onAuthSuccess }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
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
          description: "Successfully signed in with Google!",
        });
        onAuthSuccess?.();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Welcome to Oneira"
      description="Sign in with Google to start recording and analyzing your dreams"
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Join Oneira</h3>
          <p className="text-sm text-muted-foreground">
            Unlock the wisdom of your subconscious mind
          </p>
        </div>

        <Button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          variant="outline"
          className="w-full h-12 text-base flex items-center gap-3"
        >
          <FcGoogle className="h-5 w-5" />
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our terms of service and privacy policy
        </p>
      </div>
    </MobileDrawer>
  );
};