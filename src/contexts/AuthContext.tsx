import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  credits: number;
  created_at: string;
  updated_at: string;
}


interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isPasswordReset: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  clearPasswordResetState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };


  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };


  useEffect(() => {
    console.log('🔄 AuthContext: Setting up auth state...');
    
    // Check for password reset tokens in URL
    const checkPasswordReset = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Check for password reset tokens (they come in the hash fragment)
      if (hashParams.get('type') === 'recovery' || urlParams.get('type') === 'recovery') {
        console.log('🔐 AuthContext: Password reset detected');
        setIsPasswordReset(true);
        return true;
      }
      return false;
    };
    
    const isPasswordResetFlow = checkPasswordReset();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 AuthContext: Initial session:', !!session?.user);
      
      // If this is a password reset flow, don't fully authenticate the user yet
      if (isPasswordResetFlow && session?.user) {
        console.log('🔐 AuthContext: Password reset flow - holding authentication');
        setSession(session);
        setUser(session.user);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 AuthContext: User found, fetching profile...');
        setTimeout(() => {
          fetchProfile(session.user.id).then((profileData) => {
            console.log('✅ AuthContext: Profile loaded:', !!profileData);
            setProfile(profileData);
          });
        }, 0);
      }
      
      setLoading(false);
      console.log('✅ AuthContext: Initial auth setup complete');
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 AuthContext: Auth state changed:', event, !!session?.user);
      
      // Don't update state during password reset flow unless it's a password update
      if (isPasswordReset && event !== 'PASSWORD_RECOVERY') {
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && !isPasswordReset) {
        // Defer profile fetch to avoid deadlock
        setTimeout(() => {
          fetchProfile(session.user.id).then((profileData) => {
            setProfile(profileData);
          });
        }, 0);
      } else if (!session?.user) {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/journal`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/journal`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (!error) {
        // Password updated successfully, clear reset state and fetch profile
        setIsPasswordReset(false);
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Fetch profile now that password is updated
        if (user) {
          setTimeout(() => {
            fetchProfile(user.id).then((profileData) => {
              setProfile(profileData);
            });
          }, 0);
        }
      }
      
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsPasswordReset(false);
    }
    return { error };
  };

  const clearPasswordResetState = () => {
    setIsPasswordReset(false);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    isPasswordReset,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    signOut,
    refreshProfile,
    clearPasswordResetState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};