import { supabase } from "@/integrations/supabase/client";

export const useOpenAI = () => {
  const analyzeDream = async (dreamText: string) => {
    console.log('🚀 analyzeDream function called with text:', dreamText.substring(0, 50));
    console.log('🔄 Starting dream analysis...');
    console.log('💭 Dream text length:', dreamText?.length || 0);
    const startTime = Date.now();
    
    try {
      // Set a timeout for the request (30 seconds with retry mechanism)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 30 seconds - the AI service is taking too long to respond')), 30000);
      });
      
      console.log('📡 Calling NEW dream-analyzer-v2 edge function via direct HTTP...');
      console.log('🌐 Supabase URL:', 'https://ibsxglkvcfenutoqkfvb.supabase.co');
      console.log('📝 Sending dream text length:', dreamText.length);
      
      // Direct HTTP call instead of supabase.functions.invoke
      const response = await Promise.race([
        fetch('https://ibsxglkvcfenutoqkfvb.supabase.co/functions/v1/dream-analyzer-v3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlic3hnbGt2Y2ZlbnV0b3FrZnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTkyNDUsImV4cCI6MjA2OTIzNTI0NX0.lk9kCQ1aiiiMgmuG5HZjSXf-I9M4KrHHaIu9b23iYBk`,
          },
          body: JSON.stringify({ dreamText })
        }),
        timeoutPromise
      ]) as Response;
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📊 Raw response:', result);
      
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