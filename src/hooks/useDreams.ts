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

  // Save a new dream with optimistic updates
  const saveDream = async (content: string) => {
    const dreamData = {
      id: Date.now().toString(), // Temporary ID for optimistic update
      content: content.trim(),
      date: new Date().toISOString(),
      analysis: "",
      user_id: user?.id
    };

    // Optimistic update - add to UI immediately
    setDreams(prev => [dreamData, ...prev]);
    
    // Show immediate success
    toast({
      title: "Dream Recorded ✨",
      description: "Your dream has been saved to your journal.",
    });

    if (!user) {
      // Store in localStorage for non-authenticated users
      const localDreams = JSON.parse(localStorage.getItem('localDreams') || '[]');
      localStorage.setItem('localDreams', JSON.stringify([dreamData, ...localDreams]));
      return dreamData;
    }

    // Background sync to database
    try {
      console.log('💾 Background sync: Saving dream for user:', user.id);
      const dbData = {
        user_id: user.id,
        content: content.trim(),
        date: new Date().toISOString(),
        analysis: ""
      };

      const { data, error } = await supabase
        .from('dreams')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error('❌ Background sync failed:', error);
        // Update the dream with retry option
        setDreams(prev => prev.map(dream => 
          dream.id === dreamData.id 
            ? { ...dream, syncStatus: 'failed' }
            : dream
        ));
        return dreamData;
      }

      if (data) {
        console.log('✅ Background sync successful:', data);
        // Replace temporary dream with real database dream
        setDreams(prev => prev.map(dream => 
          dream.id === dreamData.id ? data : dream
        ));
        return data;
      }
    } catch (error) {
      console.error('💥 Background sync error:', error);
      // Mark as failed but don't remove from UI
      setDreams(prev => prev.map(dream => 
        dream.id === dreamData.id 
          ? { ...dream, syncStatus: 'failed' }
          : dream
      ));
    }

    return dreamData;
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