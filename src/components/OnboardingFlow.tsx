import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStep } from './OnboardingStep';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState({
    preferred_name: '',
    dream_frequency: '',
    goals_with_oneira: '',
    referral_source: '',
  });

  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    {
      title: 'Welcome to Oneira',
      description: 'Let\'s personalize your dream journaling experience',
    },
    {
      title: 'Dream Frequency',
      description: 'Understanding your dream patterns helps us customize your experience',
    },
    {
      title: 'Your Goals',
      description: 'What do you hope to discover through your dreams?',
    },
    {
      title: 'How You Found Us',
      description: 'Help us understand how people discover Oneira',
    },
  ];

  const handleStepChange = (field: keyof typeof responses, value: string) => {
    setResponses(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...responses,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      
      toast({
        title: 'Welcome to Oneira!',
        description: 'Your profile has been set up successfully.',
      });

      navigate('/journal');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentValue = () => {
    switch (currentStep) {
      case 1:
        return responses.preferred_name;
      case 2:
        return responses.dream_frequency;
      case 3:
        return responses.goals_with_oneira;
      case 4:
        return responses.referral_source;
      default:
        return '';
    }
  };

  const getCurrentField = (): keyof typeof responses => {
    switch (currentStep) {
      case 1:
        return 'preferred_name';
      case 2:
        return 'dream_frequency';
      case 3:
        return 'goals_with_oneira';
      case 4:
        return 'referral_source';
      default:
        return 'preferred_name';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Step {currentStep} of 4
        </div>
      </div>

      <OnboardingStep
        step={currentStep}
        title={steps[currentStep - 1].title}
        description={steps[currentStep - 1].description}
        value={getCurrentValue()}
        onChange={(value) => handleStepChange(getCurrentField(), value)}
        onNext={handleNext}
        onBack={currentStep > 1 ? handleBack : undefined}
        isLast={currentStep === 4}
        isLoading={isLoading}
      />
    </div>
  );
};