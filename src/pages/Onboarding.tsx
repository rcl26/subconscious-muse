import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { useAuth } from '@/contexts/AuthContext';

const Onboarding: React.FC = () => {
  const { user, profile, loading, profileLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to home
    if (!loading && !user) {
      navigate('/');
      return;
    }

    // If onboarding is already completed, redirect to journal
    if (!loading && !profileLoading && profile?.onboarding_completed) {
      navigate('/journal');
      return;
    }
  }, [user, profile, loading, profileLoading, navigate]);

  // Show loading state while checking auth and profile
  if (loading || profileLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/cosmic-background.png)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-muted/40" />
      <OnboardingFlow />
    </div>
  );
};

export default Onboarding;