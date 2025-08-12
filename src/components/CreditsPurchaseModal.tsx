import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Zap } from "lucide-react";

interface CreditsPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditsPurchaseModal = ({ open, onOpenChange }: CreditsPurchaseModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  const handlePurchaseCredits = async (amount: number, price: number) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount: amount, price: price }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onOpenChange(false);
        
        // Show instructions to user
        toast({
          title: "Payment Processing",
          description: "Complete your payment in the new tab. Your credits will be added automatically.",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { plan: 'monthly_300' }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onOpenChange(false);
        
        toast({
          title: "Subscription Setup",
          description: "Complete your subscription setup in the new tab.",
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Purchase Credits</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* One-time purchases */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">One-time Purchase</h3>
            
            <Button
              onClick={() => handlePurchaseCredits(10, 100)}
              disabled={isLoading}
              className="w-full justify-between h-16"
              variant="outline"
            >
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div className="text-left">
                  <div className="font-semibold">10 Credits</div>
                  <div className="text-sm text-muted-foreground">1 Dream Analysis</div>
                </div>
              </div>
              <div className="text-lg font-bold">$1.00</div>
            </Button>
          </div>

          {/* Subscription */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Best Value • 80+% off</h3>
            
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full justify-between h-16 bg-primary hover:bg-primary/90"
            >
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-primary-foreground text-primary text-xs font-bold">
                  ∞
                </div>
                <div className="text-left">
                  <div className="font-semibold">300 Credits/month</div>
                  <div className="text-sm text-primary-foreground/80">30 Dream Analyses</div>
                </div>
              </div>
              <div className="text-lg font-bold">$5.00/mo</div>
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Setting up payment...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};