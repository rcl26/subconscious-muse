import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackModal } from '@/components/FeedbackModal';

export const FeedbackButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Feedback
      </Button>
      <FeedbackModal 
        open={showModal} 
        onOpenChange={setShowModal} 
      />
    </>
  );
};