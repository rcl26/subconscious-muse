import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sparkles, Stars } from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const [responses, setResponses] = useState({
    preferred_name: '',
    dream_frequency: '',
    goals_with_oneira: [] as string[],
    goals_custom_text: '',
    referral_source: '',
    referral_source_detail: '',
  });
  const [showCustomGoalInput, setShowCustomGoalInput] = useState(false);

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

    // Immediately show full-screen loading state
    setIsSaving(true);
    
    try {
      // Combine goals array and custom text for database storage
      const goalsString = responses.goals_custom_text.trim() 
        ? [...responses.goals_with_oneira, responses.goals_custom_text].join(', ')
        : responses.goals_with_oneira.join(', ');

      // Create database update operation
      const databaseOperation = supabase
        .from('profiles')
        .update({
          preferred_name: responses.preferred_name,
          dream_frequency: responses.dream_frequency,
          goals_with_oneira: goalsString,
          referral_source: responses.referral_source,
          referral_source_detail: responses.referral_source_detail,
          onboarding_completed: true,
        })
        .eq('id', user.id)
        .then(result => {
          if (result.error) throw result.error;
          return result;
        });

      // Create minimum display time (3 seconds)
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 3000));

      // Wait for both database operation and minimum display time
      await Promise.all([databaseOperation, minimumDelay]);

      await refreshProfile();
      
      // Transition from saving to completion animation
      setIsSaving(false);
      setShowCompletionAnimation(true);
      
      // Navigate to journal after animation
      setTimeout(() => {
        toast({
          title: 'Welcome to Oneira!',
          description: 'Your profile has been set up successfully.',
        });
        navigate('/journal');
      }, 3500);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsSaving(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return responses.preferred_name.trim() !== '';
      case 2:
        return responses.dream_frequency !== '';
      case 3:
        return responses.goals_with_oneira.length > 0 || (showCustomGoalInput && responses.goals_custom_text.trim() !== '');
      case 4:
        return responses.referral_source !== '';
      default:
        return false;
    }
  };

  const renderSavingState = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
      <div className="text-center space-y-8 max-w-md w-full animate-fade-in">
        <div className="flex justify-center mb-8">
          <Moon className="w-20 h-20 text-primary animate-pulse filter drop-shadow-lg" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Setting up your profile...
        </h1>
        
        
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  const renderCompletionAnimation = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
      <div className="text-center space-y-8 max-w-md w-full animate-fade-in">
        <div className="relative">
          <div className="absolute -top-4 -left-4 animate-[float_6s_ease-in-out_infinite]">
            <Stars className="w-8 h-8 text-primary/60" />
          </div>
          <div className="absolute -top-8 right-4 animate-[float_6s_ease-in-out_infinite_1s]">
            <Sparkles className="w-6 h-6 text-accent/80" />
          </div>
          <div className="absolute top-16 -right-8 animate-[float_6s_ease-in-out_infinite_2s]">
            <Stars className="w-5 h-5 text-primary/40" />
          </div>
          <div className="absolute -bottom-4 left-8 animate-[float_6s_ease-in-out_infinite_0.5s]">
            <Sparkles className="w-7 h-7 text-accent/60" />
          </div>
          
          <div className="flex justify-center mb-8">
            <Moon className="w-24 h-24 text-primary animate-[float_4s_ease-in-out_infinite] filter drop-shadow-lg" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 animate-pulse">
            Setting up your journal...
          </h1>
          
          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-primary rounded-full animate-[float_1.5s_ease-in-out_infinite]"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-[float_1.5s_ease-in-out_infinite_0.2s]"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-[float_1.5s_ease-in-out_infinite_0.4s]"></div>
          </div>
          
          <p className="text-xl text-muted-foreground opacity-80">
            Preparing your cosmic dream space...
          </p>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    if (isSaving) {
      return renderSavingState();
    }
    
    if (showCompletionAnimation) {
      return renderCompletionAnimation();
    }
    
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
                  className="text-2xl h-14 bg-card/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/60 text-center rounded-xl shadow-lg shadow-primary/10 focus:shadow-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60 text-white"
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
                 What are your goals with Oneira?
               </h1>
              <div className="space-y-4">
                 {[
                   'Journaling/tracking my dreams',
                   'Exploring the meaning of my dreams'
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
                    checked={showCustomGoalInput}
                    onCheckedChange={(checked) => {
                      setShowCustomGoalInput(!!checked);
                      if (!checked) {
                        setResponses(prev => ({ ...prev, goals_custom_text: '' }));
                      }
                    }}
                  />
                  <Label htmlFor="something-else" className="text-lg cursor-pointer flex-1 text-left text-white">
                    Something else?
                  </Label>
                </div>
                {showCustomGoalInput && (
                  <Input
                    type="text"
                    placeholder="Please specify"
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
              {responses.referral_source === 'Other' && (
                <Input
                  type="text"
                  placeholder="Please specify"
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
                  disabled={!isStepValid() || isSaving || isTransitioning}
                  className="h-12 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Setup
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="font-helvetica">
      {renderScreen()}
    </div>
  );
};