import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useSubscriptionSuccess = () => {
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionStatus = urlParams.get('subscription');
    const sessionId = urlParams.get('session_id');

    if (subscriptionStatus === 'success' && sessionId) {
      // Clear URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      // Show success message
      toast({
        title: "Subscription activated!",
        description: "Welcome to unlimited dream analysis. You can now analyze all your dreams.",
      });

      // Refresh profile data after a short delay
      setTimeout(() => {
        refreshProfile();
      }, 2000);
    } else if (subscriptionStatus === 'cancelled') {
      // Clear URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      toast({
        title: "Subscription cancelled",
        description: "You can still subscribe anytime to get unlimited dream analysis.",
        variant: "destructive",
      });
    }
  }, [refreshProfile]);
};