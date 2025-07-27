import { supabase } from "@/integrations/supabase/client";

export const useOpenAI = () => {
  const analyzeDream = async (dreamText: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-dream', {
        body: { dreamText }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.analysis;
    } catch (error) {
      console.error('Error analyzing dream:', error);
      throw error;
    }
  };

  const hasApiKey = true; // Always true since we're using the edge function

  return {
    hasApiKey,
    analyzeDream,
  };
};