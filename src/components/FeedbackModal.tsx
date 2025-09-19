import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { MobileDrawer } from '@/components/MobileDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackModal = ({ open, onOpenChange }: FeedbackModalProps) => {
  const [feedbackType, setFeedbackType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackType || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Construct mailto URL with feedback details
    const userInfo = user ? `User: ${user.email}` : `Contact: ${email || 'Anonymous'}`;
    const body = `Feedback Type: ${feedbackType}

${message}

---
${userInfo}
Current Page: ${window.location.pathname}
User Agent: ${navigator.userAgent}`;

    const mailtoUrl = `mailto:feedback@oneira.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    
    // Reset form and close modal
    setFeedbackType('');
    setSubject('');
    setMessage('');
    setEmail('');
    onOpenChange(false);
    
    toast({
      title: "Feedback Sent!",
      description: "Your default email client should open with your feedback ready to send.",
    });
  };

  return (
    <MobileDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Send Feedback"
      description="Help us improve Oneira by sharing your thoughts"
      className="max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="feedback-type">Feedback Type *</Label>
          <Select value={feedbackType} onValueChange={setFeedbackType}>
            <SelectTrigger id="feedback-type">
              <SelectValue placeholder="Select feedback type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="general">General Feedback</SelectItem>
              <SelectItem value="help">Need Help</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your feedback"
            maxLength={100}
          />
        </div>

        {!user && (
          <div className="space-y-2">
            <Label htmlFor="email">Your Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please describe your feedback in detail..."
            className="min-h-[120px]"
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground">
            {message.length}/1000 characters
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!feedbackType || !subject || !message}
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </MobileDrawer>
  );
};