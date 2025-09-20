import React, { useState } from 'react';
import { MessageSquare, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const FeedbackButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 z-50"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        side="top" 
        align="end" 
        className="w-80 p-6"
        sideOffset={8}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">We'd Love to Hear From You!</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Feedback is always more than welcome. You can contact us at{' '}
            <span className="font-medium text-foreground">oneiradreamteam@gmail.com</span>
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};