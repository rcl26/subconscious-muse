import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const [responses, setResponses] = useState({
    preferred_name: '',
    dream_frequency: '',
    goals_with_oneira: [] as string[],
    goals_custom_text: '',
    referral_source: '',
    referral_source_detail: '',
  });

  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < 4) {
      setIsTransitioning(true);
      setAnimationDirection('forward');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 150);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setAnimationDirection('backward');
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Combine goals array and custom text for database storage
      const goalsString = responses.goals_custom_text.trim() 
        ? [...responses.goals_with_oneira, responses.goals_custom_text].join(', ')
        : responses.goals_with_oneira.join(', ');

      const { error } = await supabase
        .from('profiles')
        .update({
          preferred_name: responses.preferred_name,
          dream_frequency: responses.dream_frequency,
          goals_with_oneira: goalsString,
          referral_source: responses.referral_source,
          referral_source_detail: responses.referral_source_detail,
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
        return responses.goals_with_oneira.length > 0 || responses.goals_custom_text.trim() !== '';
      case 4:
        return responses.referral_source !== '';
      default:
        return false;
    }
  };

  const renderScreen = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
            <div className={`text-center space-y-8 max-w-md w-full transition-all duration-300 ease-out ${
              isTransitioning 
                ? animationDirection === 'forward' 
                  ? 'transform translate-x-full opacity-0' 
                  : 'transform -translate-x-full opacity-0'
                : 'transform translate-x-0 opacity-100'
            }`}>
              <h1 className="text-4xl md:text-6xl font-bold text-primary">
                What do you prefer to be called?
              </h1>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={responses.preferred_name}
                  onChange={(e) => setResponses(prev => ({ ...prev, preferred_name: e.target.value }))}
                  className="text-xl h-14 bg-card/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/60 text-center rounded-xl shadow-lg shadow-primary/10 focus:shadow-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60 text-white"
                  autoFocus
                />
                <div className="flex justify-between w-full">
                  <div></div>
                  <Button 
                    onClick={handleNext}
                    disabled={!isStepValid() || isTransitioning}
                    className="h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
            <div className={`text-center space-y-8 max-w-md w-full transition-all duration-300 ease-out ${
              isTransitioning 
                ? animationDirection === 'forward' 
                  ? 'transform translate-x-full opacity-0' 
                  : 'transform -translate-x-full opacity-0'
                : 'transform translate-x-0 opacity-100'
            }`}>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                How often do you dream when sleeping?
              </h1>
              <RadioGroup
                value={responses.dream_frequency}
                onValueChange={(value) => setResponses(prev => ({ ...prev, dream_frequency: value }))}
                className="space-y-4"
              >
                {['Rarely', 'A few times a week', 'Every night'].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-200">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-lg cursor-pointer flex-1 text-left text-white">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex justify-between w-full">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  disabled={isTransitioning}
                  className="h-12 text-lg border-primary/20 hover:bg-primary/10"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid() || isTransitioning}
                  className="h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
            <div className={`text-center space-y-8 max-w-md w-full transition-all duration-300 ease-out ${
              isTransitioning 
                ? animationDirection === 'forward' 
                  ? 'transform translate-x-full opacity-0' 
                  : 'transform -translate-x-full opacity-0'
                : 'transform translate-x-0 opacity-100'
            }`}>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                What are your goals with using Oneira?
              </h1>
              <div className="space-y-4">
                {[
                  'A safe space to journal my dreams',
                  'Using AI to understand the meaning of my dreams'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-200">
                    <Checkbox
                      id={option}
                      checked={responses.goals_with_oneira.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setResponses(prev => ({ 
                            ...prev, 
                            goals_with_oneira: [...prev.goals_with_oneira, option] 
                          }));
                        } else {
                          setResponses(prev => ({ 
                            ...prev, 
                            goals_with_oneira: prev.goals_with_oneira.filter(goal => goal !== option) 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-lg cursor-pointer flex-1 text-left text-white">
                      {option}
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-200">
                  <Checkbox
                    id="something-else"
                    checked={responses.goals_custom_text.trim() !== ''}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setResponses(prev => ({ ...prev, goals_custom_text: ' ' })); // Set a space to trigger the input
                      } else {
                        setResponses(prev => ({ ...prev, goals_custom_text: '' }));
                      }
                    }}
                  />
                  <Label htmlFor="something-else" className="text-lg cursor-pointer flex-1 text-left text-white">
                    Something else?
                  </Label>
                </div>
                {responses.goals_custom_text !== '' && (
                  <Input
                    type="text"
                    placeholder="Please specify your goal"
                    value={responses.goals_custom_text}
                    onChange={(e) => setResponses(prev => ({ ...prev, goals_custom_text: e.target.value }))}
                    className="text-lg h-14 bg-card/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/60 text-center rounded-xl shadow-lg shadow-primary/10 focus:shadow-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60 text-white"
                  />
                )}
              </div>
              <div className="flex justify-between w-full">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  disabled={isTransitioning}
                  className="h-12 text-lg border-primary/20 hover:bg-primary/10"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid() || isTransitioning}
                  className="h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
            <div className={`text-center space-y-8 max-w-md w-full transition-all duration-300 ease-out ${
              isTransitioning 
                ? animationDirection === 'forward' 
                  ? 'transform translate-x-full opacity-0' 
                  : 'transform -translate-x-full opacity-0'
                : 'transform translate-x-0 opacity-100'
            }`}>
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                How did you hear about us?
              </h1>
              <RadioGroup
                value={responses.referral_source}
                onValueChange={(value) => setResponses(prev => ({ ...prev, referral_source: value }))}
                className="space-y-4"
              >
                {[
                  'Social media',
                  'Search engine',
                  'Friend/family',
                  'Blog/article',
                  'Other'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-200">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-lg cursor-pointer flex-1 text-left text-white">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {(responses.referral_source === 'Blog/article' || responses.referral_source === 'Other') && (
                <Input
                  type="text"
                  placeholder={responses.referral_source === 'Blog/article' ? 'Which blog or article?' : 'Please specify'}
                  value={responses.referral_source_detail}
                  onChange={(e) => setResponses(prev => ({ ...prev, referral_source_detail: e.target.value }))}
                  className="text-lg h-14 bg-card/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/60 text-center rounded-xl shadow-lg shadow-primary/10 focus:shadow-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60 text-white"
                />
              )}
              <div className="flex justify-between w-full">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  disabled={isTransitioning}
                  className="h-12 text-lg border-primary/20 hover:bg-primary/10"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!isStepValid() || isLoading || isTransitioning}
                  className="h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Setting up your profile...' : 'Complete Setup'}
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderScreen();
};