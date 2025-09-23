import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
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
  });

  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
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

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return responses.preferred_name.trim() !== '';
      case 2:
        return responses.dream_frequency !== '';
      case 3:
        return responses.goals_with_oneira !== '';
      default:
        return false;
    }
  };

  const renderScreen = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
            <div className="text-center space-y-8 max-w-md w-full animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                What should we call you?
              </h1>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={responses.preferred_name}
                  onChange={(e) => setResponses(prev => ({ ...prev, preferred_name: e.target.value }))}
                  className="text-lg h-12 bg-card/80 border-primary/20 focus:border-primary text-center"
                  autoFocus
                />
                {responses.preferred_name && (
                  <Button 
                    onClick={handleNext}
                    className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
            <div className="text-center space-y-8 max-w-md w-full animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                How often do you dream when sleeping?
              </h1>
              <RadioGroup
                value={responses.dream_frequency}
                onValueChange={(value) => setResponses(prev => ({ ...prev, dream_frequency: value }))}
                className="space-y-4"
              >
                {['Rarely', 'A few times a week', 'Every night'].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-lg cursor-pointer flex-1 text-left">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {responses.dream_frequency && (
                <Button 
                  onClick={handleNext}
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
            <div className="text-center space-y-8 max-w-md w-full animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                What are your goals with using Oneira?
              </h1>
              <RadioGroup
                value={responses.goals_with_oneira}
                onValueChange={(value) => setResponses(prev => ({ ...prev, goals_with_oneira: value }))}
                className="space-y-4"
              >
                {[
                  'A safe space to journal my dreams',
                  'Using AI to understand the meaning of my dreams'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-lg cursor-pointer flex-1 text-left">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {responses.goals_with_oneira && (
                <Button 
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Setting up your profile...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderScreen();
};