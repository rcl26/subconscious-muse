import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Generate a simple session ID that persists for the browser session
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const { user, profile } = useAuth();
  const [sessionId] = useState(getSessionId);

  const trackEvent = useCallback(async (eventType: string, eventData?: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('user_events')
        .insert({
          user_id: user?.id || null,
          email: user?.email || profile?.email || null,
          event_type: eventType,
          event_data: eventData || {},
          session_id: sessionId,
        });

      if (error) {
        console.warn('Analytics tracking failed:', error);
      }
    } catch (error) {
      // Fail silently to avoid disrupting user experience
      console.warn('Analytics tracking error:', error);
    }
  }, [user?.id, user?.email, profile?.email, sessionId]);

  return { trackEvent };
};