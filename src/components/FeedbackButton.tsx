import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const FeedbackButton = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Contact Us",
      description: "Send us your feedback at oneiradreamteam@gmail.com",
      duration: 5000,
    });
  };

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 z-50"
    >
      <MessageSquare className="h-5 w-5" />
    </Button>
  );
};