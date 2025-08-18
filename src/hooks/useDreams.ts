import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

  // Load dreams from database or localStorage
  const loadDreams = async () => {
    if (!user) {
      // Load from localStorage for non-authenticated users
      try {
        const localDreams = JSON.parse(localStorage.getItem('localDreams') || '[]');
        console.log('📱 Loaded local dreams:', localDreams.length);
        setDreams(localDreams);
      } catch (error) {
        console.error('Error loading local dreams:', error);
        setDreams([]);
      }
      setIsLoading(false);
      return;
    }

    try {
      console.log('📥 Loading dreams for user:', user.id);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 20000); // Increased to 20 seconds
      });
      
      const queryPromise = supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      console.log('🔄 Executing dreams query...');
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      console.log('📋 Query completed. Data:', data?.length || 0, 'Error:', error);

      if (error) {
        console.error('❌ Error loading dreams:', error);
        throw error;
      }

      // Merge with any local dreams and sync them to database
      const localDreams = JSON.parse(localStorage.getItem('localDreams') || '[]');
      if (localDreams.length > 0) {
        console.log('🔄 Syncing local dreams to database:', localDreams.length);
        // Sync local dreams to database in background
        syncLocalDreamsToDatabase(localDreams);
      }

      console.log('✅ Loaded dreams:', data?.length || 0);
      setDreams([...localDreams, ...(data || [])]);
    } catch (error) {
      console.error('Error loading dreams:', error);
      
      // Try to fallback to local dreams before showing error
      const localDreams = JSON.parse(localStorage.getItem('localDreams') || '[]');
      if (localDreams.length > 0) {
        console.log('📱 Fallback: Using local dreams only');
        setDreams(localDreams);
      } else {
        // Only show error toast if no local fallback available
        toast.error("Error Loading Dreams", {
          description: "Unable to connect to database. Please check your connection.",
        });
        setDreams([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sync local dreams to database and clean up localStorage
  const syncLocalDreamsToDatabase = async (localDreams: Dream[]) => {
    if (!user || localDreams.length === 0) return;

    try {
      const dbData = localDreams.map(dream => ({
        user_id: user.id,
        content: dream.content,
        date: dream.date,
        analysis: dream.analysis || ""
      }));

      const { data, error } = await supabase
        .from('dreams')
        .insert(dbData)
        .select();

      if (error) {
        console.error('❌ Failed to sync local dreams:', error);
        return;
      }

      if (data) {
        console.log('✅ Successfully synced local dreams to database');
        // Clear localStorage after successful sync
        localStorage.removeItem('localDreams');
        
        // Update dreams with database versions
        setDreams(prev => {
          const nonLocalDreams = prev.filter(dream => 
            !localDreams.some(local => local.id === dream.id)
          );
          return [...data, ...nonLocalDreams].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        });
      }
    } catch (error) {
      console.error('💥 Error syncing local dreams:', error);
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
    
    // Show subtle success notification
    toast.success("Dream recorded ✨", {
      description: "Saved to your journal",
      duration: 3000,
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

  // Helper function to check if an ID is a temporary timestamp ID
  const isTemporaryId = (id: string): boolean => {
    // Temporary IDs are timestamp strings (all digits)
    // Real UUIDs contain hyphens and letters
    return /^\d+$/.test(id);
  };

  // Delete a dream
  const deleteDream = async (dreamId: string) => {
    try {
      console.log('🗑️ Deleting dream:', dreamId);
      
      // Check if this is a temporary ID (optimistic update) or real UUID
      if (isTemporaryId(dreamId)) {
        console.log('📱 Deleting temporary dream (local only)');
        // For temporary IDs, just remove from local state and localStorage
        setDreams(prev => prev.filter(dream => dream.id !== dreamId));
        
        // Also remove from localStorage if user is not authenticated
        if (!user) {
          const localDreams = JSON.parse(localStorage.getItem('localDreams') || '[]');
          const updatedLocalDreams = localDreams.filter((dream: Dream) => dream.id !== dreamId);
          localStorage.setItem('localDreams', JSON.stringify(updatedLocalDreams));
        }
        
        return true;
      }
      
      // For real UUIDs, delete from database
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', dreamId);

      if (error) {
        console.error('❌ Error deleting dream:', error);
        throw error;
      }

      console.log('✅ Dream deleted from database');
      
      // Remove from local state
      setDreams(prev => prev.filter(dream => dream.id !== dreamId));
      
      return true;
    } catch (error) {
      console.error('Error deleting dream:', error);
      toast.error("Error Deleting Dream", {
        description: "Unable to delete the dream. Please try again.",
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