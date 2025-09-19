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
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-card border-border shadow-float hover:shadow-dream transition-all duration-200 hover:scale-105"
        aria-label="Send feedback"
      >
        <MessageSquare className="h-5 w-5 text-primary" />
      </Button>
      <FeedbackModal 
        open={showModal} 
        onOpenChange={setShowModal} 
      />
    </>
  );
};