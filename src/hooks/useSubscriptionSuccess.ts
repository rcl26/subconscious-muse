import { useEffect } from 'react';

export const useSubscriptionSuccess = () => {
  useEffect(() => {
    // Clean up any subscription-related URL parameters from old versions
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionStatus = urlParams.get('subscription');
    const sessionId = urlParams.get('session_id');

    if (subscriptionStatus || sessionId) {
      // Clear URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);
};