import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Dream {
  id: string;
  content: string;
  date: string;
  analysis: string;
  conversations?: Message[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useDreams = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load dreams from database (authenticated users only)
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
        toast.error("Error Loading Dreams", {
          description: "Unable to load your dreams. Please try again.",
        });
        setDreams([]);
        return;
      }

      console.log('✅ Loaded dreams:', data?.length || 0);
      // Parse conversations from JSON strings
      const parsedData = (data || []).map(dream => ({
        ...dream,
        conversations: dream.conversations ? JSON.parse(typeof dream.conversations === 'string' ? dream.conversations : JSON.stringify(dream.conversations)) : []
      }));
      setDreams(parsedData);
    } catch (error) {
      console.error('Error loading dreams:', error);
      toast.error("Error Loading Dreams", {
        description: "Unable to connect to database. Please check your connection.",
      });
      setDreams([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new dream (authenticated users only)
  const saveDream = async (content: string, showToast = true) => {
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to record dreams",
      });
      return null;
    }

    const dreamData = {
      id: Date.now().toString(), // Temporary ID for optimistic update
      content: content.trim(),
      date: new Date().toISOString(),
      analysis: "",
      user_id: user.id
    };

    // Optimistic update - add to UI immediately
    setDreams(prev => [dreamData, ...prev]);
    
    // Show success notification only if requested
    if (showToast) {
      toast.success("Dream recorded ✨", {
        description: "Saved to your journal",
        duration: 3000,
      });
    }

    try {
      console.log('💾 Saving dream for user:', user.id);
      const dbData = {
        user_id: user.id,
        content: content.trim(),
        date: new Date().toISOString(),
        analysis: "",
        conversations: '[]'
      };

      const { data, error } = await supabase
        .from('dreams')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error('❌ Save failed:', error);
        // Remove optimistic update on error
        setDreams(prev => prev.filter(dream => dream.id !== dreamData.id));
        toast.error("Error saving dream", {
          description: "Please try again",
        });
        return null;
      }

      if (data) {
        console.log('✅ Dream saved successfully:', data);
        // Replace temporary dream with real database dream
        const parsedData = {
          ...data,
          conversations: data.conversations ? JSON.parse(typeof data.conversations === 'string' ? data.conversations : JSON.stringify(data.conversations)) : []
        };
        setDreams(prev => prev.map(dream => 
          dream.id === dreamData.id ? parsedData : dream
        ));
        return data;
      }
    } catch (error) {
      console.error('💥 Save error:', error);
      // Remove optimistic update on error
      setDreams(prev => prev.filter(dream => dream.id !== dreamData.id));
      toast.error("Error saving dream", {
        description: "Please try again",
      });
    }

    return null;
  };

  // Helper function to check if an ID is a temporary timestamp ID
  const isTemporaryId = (id: string): boolean => {
    return /^\d+$/.test(id);
  };

  // Delete a dream
  const deleteDream = async (dreamId: string) => {
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to delete dreams",
      });
      return false;
    }

    try {
      console.log('🗑️ Deleting dream:', dreamId);
      
      // Check if this is a temporary ID (optimistic update) or real UUID
      if (isTemporaryId(dreamId)) {
        console.log('📱 Deleting temporary dream (local only)');
        setDreams(prev => prev.filter(dream => dream.id !== dreamId));
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
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to update dreams",
      });
      return false;
    }

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

  // Update dream conversation
  const updateDreamConversation = async (dreamId: string, conversations: Message[]) => {
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to update conversations",
      });
      return false;
    }

    try {
      console.log('💬 Updating dream conversation:', dreamId);
      
      // Check if this is a temporary ID (optimistic update) or real UUID
      if (isTemporaryId(dreamId)) {
        console.log('📱 Updating temporary dream conversation (local only)');
        setDreams(prev => prev.map(dream => 
          dream.id === dreamId ? { ...dream, conversations } : dream
        ));
        return true;
      }
      
      // For real UUIDs, update database
      const { error } = await supabase
        .from('dreams')
        .update({ conversations: JSON.stringify(conversations) })
        .eq('id', dreamId);

      if (error) {
        console.error('❌ Error updating conversation:', error);
        throw error;
      }

      console.log('✅ Conversation updated');
      
      // Update local state
      setDreams(prev => prev.map(dream => 
        dream.id === dreamId ? { ...dream, conversations } : dream
      ));
      
      return true;
    } catch (error) {
      console.error('Error updating conversation:', error);
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
    updateDreamConversation,
    loadDreams
  };
};