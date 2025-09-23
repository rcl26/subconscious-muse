import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface OnboardingStepProps {
  step: number;
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  isLast?: boolean;
  isLoading?: boolean;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  step,
  title,
  description,
  value,
  onChange,
  onNext,
  onBack,
  isLast = false,
  isLoading = false,
}) => {
  const renderInput = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-2">
            <Label htmlFor="preferred-name">What would you like us to call you?</Label>
            <Input
              id="preferred-name"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your preferred name"
              className="w-full"
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <Label>How often do you remember your dreams?</Label>
            <RadioGroup value={value} onValueChange={onChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">A few times a week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">A few times a month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely" id="rarely" />
                <Label htmlFor="rarely">Rarely</Label>
              </div>
            </RadioGroup>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-2">
            <Label htmlFor="goals">What do you hope to achieve with Oneira?</Label>
            <Textarea
              id="goals"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Share your goals and intentions with dream journaling..."
              className="w-full min-h-[100px]"
            />
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <Label>How did you hear about Oneira?</Label>
            <RadioGroup value={value} onValueChange={onChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="search" id="search" />
                <Label htmlFor="search">Search engine</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="social" id="social" />
                <Label htmlFor="social">Social media</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friend" id="friend" />
                <Label htmlFor="friend">Friend or family</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blog" id="blog" />
                <Label htmlFor="blog">Blog or article</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        );
      
      default:
        return null;
    }
  };

  const canProceed = () => {
    return value.trim().length > 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {renderInput()}

      <div className="flex justify-between pt-4">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        ) : (
          <div />
        )}
        
        <Button 
          onClick={onNext} 
          disabled={!canProceed() || isLoading}
        >
          {isLoading ? 'Saving...' : isLast ? 'Complete Setup' : 'Next'}
        </Button>
      </div>
    </div>
  );
};