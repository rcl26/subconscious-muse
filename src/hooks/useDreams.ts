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
}

export const useDreams = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load dreams when user changes or component mounts
  useEffect(() => {
    if (user) {
      loadDreams();
    } else {
      setDreams([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadDreams = async () => {
    if (!user) return;
    
    try {
      console.log('📖 Loading dreams from database...');
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('❌ Error loading dreams:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} dreams`);
      setDreams(data || []);
    } catch (error) {
      console.error('Failed to load dreams:', error);
      toast({
        title: "Error Loading Dreams",
        description: "Unable to load your dreams. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDream = async (dreamContent: string) => {
    if (!user) {
      // For unauthenticated users, store locally (temporary)
      const newDream: Dream = {
        id: Date.now().toString(),
        content: dreamContent,
        date: new Date().toISOString(),
        analysis: ""
      };
      setDreams(prev => [newDream, ...prev]);
      return newDream;
    }

    try {
      console.log('💾 Saving dream to database...');
      const dreamData = {
        user_id: user.id,
        content: dreamContent,
        date: new Date().toISOString(),
        analysis: ""
      };

      const { data, error } = await supabase
        .from('dreams')
        .insert(dreamData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error saving dream:', error);
        throw error;
      }

      console.log('✅ Dream saved successfully');
      const newDream: Dream = data;
      setDreams(prev => [newDream, ...prev]);
      return newDream;
    } catch (error) {
      console.error('Failed to save dream:', error);
      toast({
        title: "Error Saving Dream",
        description: "Unable to save your dream. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDream = async (dreamId: string) => {
    const dreamToDelete = dreams.find(d => d.id === dreamId);
    if (!dreamToDelete) return null;

    // Optimistically remove from UI
    setDreams(prev => prev.filter(d => d.id !== dreamId));

    if (user) {
      try {
        console.log('🗑️ Deleting dream from database...');
        const { error } = await supabase
          .from('dreams')
          .delete()
          .eq('id', dreamId)
          .eq('user_id', user.id);

        if (error) {
          console.error('❌ Error deleting dream:', error);
          // Restore dream to UI on error
          setDreams(prev => [dreamToDelete, ...prev]);
          throw error;
        }

        console.log('✅ Dream deleted successfully');
      } catch (error) {
        console.error('Failed to delete dream:', error);
        toast({
          title: "Error Deleting Dream",
          description: "Unable to delete your dream. Please try again.",
          variant: "destructive",
        });
      }
    }

    return dreamToDelete;
  };

  const updateDreamAnalysis = async (dreamId: string, analysis: string) => {
    if (!user) return;

    try {
      console.log('🔄 Updating dream analysis...');
      const { error } = await supabase
        .from('dreams')
        .update({ analysis })
        .eq('id', dreamId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error updating analysis:', error);
        throw error;
      }

      console.log('✅ Dream analysis updated');
      setDreams(prev => prev.map(dream => 
        dream.id === dreamId ? { ...dream, analysis } : dream
      ));
    } catch (error) {
      console.error('Failed to update dream analysis:', error);
      toast({
        title: "Error Updating Analysis",
        description: "Unable to save the analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    dreams,
    isLoading,
    saveDream,
    deleteDream,
    updateDreamAnalysis,
    refreshDreams: loadDreams
  };
};