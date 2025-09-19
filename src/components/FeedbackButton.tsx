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
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 z-50"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      <FeedbackModal 
        open={showModal} 
        onOpenChange={setShowModal} 
      />
    </>
  );
};