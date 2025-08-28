import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Smartphone, ArrowLeft } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [authStep, setAuthStep] = useState<'main' | 'phone' | 'otp'>('main');
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<'google' | 'apple' | 'phone' | 'otp' | null>(null);
  const { signInWithGoogle, signInWithApple, signInWithPhone, verifyOtp } = useAuth();
  const { toast } = useToast();

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setLoadingMethod(provider);

    try {
      const { error } = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithApple();

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setIsLoading(true);
    setLoadingMethod('phone');

    try {
      const { error } = await signInWithPhone(phone);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAuthStep('otp');
        toast({
          title: "Code sent",
          description: "Please check your phone for the verification code.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !phone) return;
    
    setIsLoading(true);
    setLoadingMethod('otp');

    try {
      const { error } = await verifyOtp(phone, otp);

      if (error) {
        toast({
          title: "Verification Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        onOpenChange(false);
        setAuthStep('main');
        setPhone("");
        setOtp("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  };

  const resetToMain = () => {
    setAuthStep('main');
    setPhone("");
    setOtp("");
    setIsLoading(false);
    setLoadingMethod(null);
  };

  const getTitle = () => {
    switch (authStep) {
      case 'phone': return "Phone Sign In";
      case 'otp': return "Enter Code";
      default: return "Sign In";
    }
  };

  const renderMainAuthOptions = () => (
    <div className="space-y-4">
      <Button
        onClick={() => handleOAuthSignIn('google')}
        className="w-full h-12 bg-card hover:bg-accent border border-border text-foreground"
        disabled={isLoading}
      >
        {loadingMethod === 'google' ? (
          <Loader2 className="h-5 w-5 mr-3 animate-spin" />
        ) : (
          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continue with Google
      </Button>

      <Button
        onClick={() => handleOAuthSignIn('apple')}
        className="w-full h-12 bg-card hover:bg-accent border border-border text-foreground"
        disabled={isLoading}
      >
        {loadingMethod === 'apple' ? (
          <Loader2 className="h-5 w-5 mr-3 animate-spin" />
        ) : (
          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        )}
        Continue with Apple
      </Button>

      <Button
        onClick={() => setAuthStep('phone')}
        className="w-full h-12 bg-card hover:bg-accent border border-border text-foreground"
        disabled={isLoading}
      >
        <Smartphone className="h-5 w-5 mr-3" />
        Continue with Phone
      </Button>
    </div>
  );

  const renderPhoneAuth = () => (
    <form onSubmit={handlePhoneSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1234567890"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {loadingMethod === 'phone' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Send Code
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={resetToMain}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to options
      </Button>
    </form>
  );

  const renderOtpVerification = () => (
    <form onSubmit={handleOtpVerification} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          required
          maxLength={6}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {loadingMethod === 'otp' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Verify Code
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => setAuthStep('phone')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Change phone number
      </Button>
    </form>
  );

  return (
    <MobileDrawer
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetToMain();
      }}
      title={getTitle()}
      className="sm:max-w-md"
    >
      {authStep === 'main' && renderMainAuthOptions()}
      {authStep === 'phone' && renderPhoneAuth()}
      {authStep === 'otp' && renderOtpVerification()}
    </MobileDrawer>
  );
};