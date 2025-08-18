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
      
      console.log('📡 Calling analyze-dream edge function...');
      console.log('🌐 Supabase URL:', 'https://ibsxglkvcfenutoqkfvb.supabase.co');
      console.log('📝 Sending dream text length:', dreamText.length);
      
      const { data, error } = await Promise.race([
        supabase.functions.invoke('analyze-dream', {
          body: { dreamText }
        }),
        timeoutPromise
      ]) as any;
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Analysis completed in ${duration}ms`);

      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.error('❌ No data received from edge function');
        throw new Error('No response received from analysis service');
      }

      if (data.error) {
        console.error('❌ Analysis service error:', data.error);
        throw new Error(data.error);
      }

      console.log('✅ Analysis successful');
      return data.analysis;
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