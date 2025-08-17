import { useState } from "react";
import { PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface DreamRecorderProps {
  onDreamRecorded: (dreamText: string) => void;
}

export const DreamRecorder = ({ onDreamRecorded }: DreamRecorderProps) => {
  const [dreamText, setDreamText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextSubmit = async () => {
    if (isSubmitting || !dreamText.trim()) {
      console.log('❌ DreamRecorder: Submission blocked - isSubmitting:', isSubmitting, 'hasText:', !!dreamText.trim());
      return;
    }

    console.log('🎯 DreamRecorder: Starting dream submission with text:', dreamText.trim());
    setIsSubmitting(true);
    
    try {
      console.log('🚀 DreamRecorder: Calling onDreamRecorded callback');
      
      // Add timeout protection to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Dream save timeout')), 10000); // 10 second timeout
      });
      
      const savePromise = onDreamRecorded(dreamText.trim());
      
      await Promise.race([savePromise, timeoutPromise]);
      console.log('✅ DreamRecorder: Dream saved successfully');
      
      // Clear the text only on success
      setDreamText("");
      console.log('🧹 DreamRecorder: Text cleared');
    } catch (error) {
      console.error('💥 DreamRecorder: Error saving dream:', error);
      // Don't clear text on error so user can retry
    } finally {
      setIsSubmitting(false);
      console.log('🔓 DreamRecorder: Submission state reset');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  return (
    <Card className="p-8 bg-gradient-dream shadow-dream border-0">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <PenTool className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary">Record Your Dream</h2>
          </div>
          <p className="text-muted-foreground">
            Take a moment to capture the essence of your dream while it's still fresh
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Describe your dream in as much detail as you can remember..."
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[200px] bg-background/50 border-primary/20 focus:border-primary/40 transition-magical resize-none text-left"
            autoFocus
          />
          <div className="space-y-2">
          <Button
            onClick={handleTextSubmit}
            disabled={!dreamText.trim() || isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 transition-magical"
          >
            {isSubmitting ? "Saving..." : "Save Dream"}
          </Button>
            <p className="text-xs text-muted-foreground">
              Tip: Press Cmd/Ctrl + Enter to save quickly
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};