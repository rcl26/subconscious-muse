import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Zap } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase a subscription.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { plan: 'weekly_unlimited' }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to create subscription session');
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onOpenChange(false);
        
        toast({
          title: "Subscription Setup",
          description: "Complete your subscription setup in the new tab.",
        });
      } else {
        throw new Error('No subscription URL received');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: error instanceof Error ? error.message : "Failed to create subscription. Please try again.",
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
      title="Get Unlimited Access"
      className="sm:max-w-md"
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Unlimited Dream Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Get unlimited access to AI-powered dream analysis for just $1 per week
          </p>
        </div>
        
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full justify-between h-16 bg-primary hover:bg-primary/90"
        >
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-primary-foreground text-primary text-lg font-bold">
              ∞
            </div>
            <div className="text-left">
              <div className="font-semibold">Unlimited Dreams</div>
              <div className="text-sm text-primary-foreground/80">Analyze as many dreams as you want</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">$1</div>
            <div className="text-xs text-primary-foreground/80">per week</div>
          </div>
        </Button>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Setting up subscription...</span>
          </div>
        )}
      </div>
    </MobileDrawer>
  );
};