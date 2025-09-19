import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useOpenAI = () => {
  const { hasActiveSubscription } = useAuth();
  const analyzeDream = async (dreamText: string) => {
    // Check subscription status first
    if (!hasActiveSubscription) {
      throw new Error('SUBSCRIPTION_REQUIRED');
    }

    console.log('🚀 analyzeDream function called with text:', dreamText.substring(0, 50));
    console.log('🔄 Starting dream analysis...');
    console.log('💭 Dream text length:', dreamText?.length || 0);
    const startTime = Date.now();
    
    try {
      // Set a timeout for the request (30 seconds with retry mechanism)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 30 seconds - the AI service is taking too long to respond')), 30000);
      });
      
      console.log('📡 Calling analyze-dream edge function via direct HTTP...');
      console.log('🌐 Supabase URL:', 'https://ibsxglkvcfenutoqkfvb.supabase.co');
      console.log('📝 Sending dream text length:', dreamText.length);
      
      // Direct HTTP call instead of supabase.functions.invoke
      const response = await Promise.race([
        fetch('https://ibsxglkvcfenutoqkfvb.supabase.co/functions/v1/analyze-dream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlic3hnbGt2Y2ZlbnV0b3FrZnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTkyNDUsImV4cCI6MjA2OTIzNTI0NX0.lk9kCQ1aiiiMgmuG5HZjSXf-I9M4KrHHaIu9b23iYBk`,
          },
          body: JSON.stringify({ dreamText })
        }),
        timeoutPromise
      ]) as Response;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Analysis completed in ${duration}ms`);

      if (result.error) {
        console.error('❌ Analysis service error:', result.error);
        throw new Error(result.error);
      }

      if (!result.analysis) {
        console.error('❌ No analysis received from edge function');
        throw new Error('No response received from analysis service');
      }

      console.log('✅ Analysis successful');
      return result.analysis;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Error analyzing dream after ${duration}ms:`, error);
      throw error;
    }
  };

  const hasApiKey = true; // Always true since we're using the edge function

  return {
    hasApiKey,
    analyzeDream,
  };
};