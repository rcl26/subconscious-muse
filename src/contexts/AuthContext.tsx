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

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan_type: string;
  current_period_start: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  session: Session | null;
  loading: boolean;
  hasActiveSubscription: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  signOut: () => Promise<any>;
  refreshProfile: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const refreshSubscription = async () => {
    if (user) {
      const subscriptionData = await fetchSubscription(user.id);
      setSubscription(subscriptionData);
    }
  };

  const hasActiveSubscription = subscription?.status === 'active';

  useEffect(() => {
    console.log('🔄 AuthContext: Setting up auth state...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 AuthContext: Initial session:', !!session?.user);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 AuthContext: User found, fetching profile and subscription...');
        setTimeout(() => {
          Promise.all([
            fetchProfile(session.user.id),
            fetchSubscription(session.user.id)
          ]).then(([profileData, subscriptionData]) => {
            console.log('✅ AuthContext: Profile and subscription loaded:', !!profileData, !!subscriptionData);
            setProfile(profileData);
            setSubscription(subscriptionData);
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
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Defer profile and subscription fetch to avoid deadlock
        setTimeout(() => {
          Promise.all([
            fetchProfile(session.user.id),
            fetchSubscription(session.user.id)
          ]).then(([profileData, subscriptionData]) => {
            setProfile(profileData);
            setSubscription(subscriptionData);
          });
        }, 0);
      } else {
        setProfile(null);
        setSubscription(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/journal`
      }
    });
    return { data, error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/journal`
      }
    });
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    // Use current origin for development flexibility
    const redirectUrl = `${window.location.origin}/journal`;
    console.log('🔄 Sending password reset email with redirect:', redirectUrl);
    console.log('ℹ️ Current app URL:', window.location.origin);
    console.log('⚠️ Make sure Supabase Site URL matches this URL in Dashboard → Authentication → URL Configuration');
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    if (error) {
      console.error('❌ Password reset email failed:', error);
    } else {
      console.log('✅ Password reset email sent successfully');
      console.log('📧 Check email and ensure the link redirects to:', redirectUrl);
    }
    
    return { data, error };
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
      setSubscription(null);
      setSession(null);
    }
    return { error };
  };

  const value = {
    user,
    profile,
    subscription,
    session,
    loading,
    hasActiveSubscription,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    updatePassword,
    signOut,
    refreshProfile,
    refreshSubscription,
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