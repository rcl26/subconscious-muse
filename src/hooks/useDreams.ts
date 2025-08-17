import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Dream {
  id: string;
  content: string;
  date: string;
  analysis: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useDreams = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load dreams from database
  const loadDreams = async () => {
    if (!user) {
      setDreams([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('📥 Loading dreams for user:', user.id);
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('❌ Error loading dreams:', error);
        throw error;
      }

      console.log('✅ Loaded dreams:', data?.length || 0);
      setDreams(data || []);
    } catch (error) {
      console.error('Error loading dreams:', error);
      toast({
        title: "Error Loading Dreams",
        description: "Unable to load your dreams. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new dream
  const saveDream = async (content: string) => {
    if (!user) {
      // For testing without auth, create a local dream
      const localDream = {
        id: Date.now().toString(),
        content: content.trim(),
        date: new Date().toISOString(),
        analysis: ""
      };
      
      setDreams(prev => [localDream, ...prev]);
      
      toast({
        title: "Dream Recorded ✨",
        description: "Your dream has been saved locally (sign in to save permanently).",
      });
      
      return localDream;
    }

    try {
      console.log('💾 Saving dream for user:', user.id);
      const dreamData = {
        user_id: user.id,
        content: content.trim(),
        date: new Date().toISOString(),
        analysis: ""
      };

      console.log('📤 Inserting dream data:', dreamData);
      const { data, error } = await supabase
        .from('dreams')
        .insert([dreamData])
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      if (!data) {
        console.error('❌ No data returned from insert');
        throw new Error('No data returned from database insert');
      }

      console.log('✅ Dream saved successfully:', data);
      
      // Add to local state
      setDreams(prev => [data, ...prev]);
      
      toast({
        title: "Dream Recorded ✨",
        description: "Your dream has been saved to your journal.",
      });

      return data;
    } catch (error) {
      console.error('💥 Error saving dream:', error);
      toast({
        title: "Error Saving Dream",
        description: `Unable to save your dream: ${error.message}. Please try again.`,
        variant: "destructive",
      });
      return null;
    }
  };

  // Delete a dream
  const deleteDream = async (dreamId: string) => {
    try {
      console.log('🗑️ Deleting dream:', dreamId);
      
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', dreamId);

      if (error) {
        console.error('❌ Error deleting dream:', error);
        throw error;
      }

      console.log('✅ Dream deleted');
      
      // Remove from local state
      setDreams(prev => prev.filter(dream => dream.id !== dreamId));
      
      return true;
    } catch (error) {
      console.error('Error deleting dream:', error);
      toast({
        title: "Error Deleting Dream",
        description: "Unable to delete the dream. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update dream analysis
  const updateDreamAnalysis = async (dreamId: string, analysis: string) => {
    try {
      console.log('📝 Updating dream analysis:', dreamId);
      
      const { error } = await supabase
        .from('dreams')
        .update({ analysis })
        .eq('id', dreamId);

      if (error) {
        console.error('❌ Error updating analysis:', error);
        throw error;
      }

      console.log('✅ Analysis updated');
      
      // Update local state
      setDreams(prev => prev.map(dream => 
        dream.id === dreamId ? { ...dream, analysis } : dream
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating analysis:', error);
      return false;
    }
  };

  // Load dreams when user changes
  useEffect(() => {
    loadDreams();
  }, [user]);

  return {
    dreams,
    isLoading,
    saveDream,
    deleteDream,
    updateDreamAnalysis,
    loadDreams
  };
};