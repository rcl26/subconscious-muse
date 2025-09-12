import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileDrawer } from '@/components/MobileDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PasswordResetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const PasswordResetModal = ({ open, onOpenChange, onSuccess }: PasswordResetModalProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { updatePassword } = useAuth();
  const { toast } = useToast();

  const resetState = () => {
    setPassword('');
    setConfirmPassword('');
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter both password fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Attempting password update...');
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('❌ Password update failed:', error);
        toast({
          title: "Update Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('✅ Password updated successfully');
        toast({
          title: "Success!",
          description: "Your password has been updated successfully.",
        });
        onSuccess?.();
        onOpenChange(false);
        resetState();
      }
    } catch (error: any) {
      console.error('❌ Password update exception:', error);
      toast({
        title: "Update Error",
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
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetState();
      }}
      title="Set New Password"
      description="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={6}
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-base"
        >
          {isLoading ? 'Updating Password...' : 'Update Password'}
        </Button>
      </form>
    </MobileDrawer>
  );
};