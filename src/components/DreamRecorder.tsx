import { useState } from "react";
import { PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const MAX_TITLE_CHARACTERS = 50;
const MAX_CONTENT_CHARACTERS = 500;

interface DreamRecorderProps {
  onDreamRecorded: (dreamText: string, title?: string) => void;
}

export const DreamRecorder = ({ onDreamRecorded }: DreamRecorderProps) => {
  const [dreamText, setDreamText] = useState("");
  const [dreamTitle, setDreamTitle] = useState("");

  const handleTextSubmit = () => {
    if (!dreamText.trim()) return;
    
    console.log('🚀 DreamRecorder: Starting dream submission');
    
    // Call the callback synchronously - no more async chains!
    onDreamRecorded(dreamText.trim(), dreamTitle.trim() || undefined);
    
    // Clear the text and title immediately
    setDreamText("");
    setDreamTitle("");
    console.log('✅ DreamRecorder: Dream submitted and text cleared');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  return (
    <Card className="p-8 bg-card shadow-dream border-0">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <PenTool className="h-6 w-6 text-card-foreground" />
            <h2 className="text-2xl font-semibold text-card-foreground">Record Your Dream</h2>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Textarea
              placeholder="Describe your dream in as much detail as you can remember..."
              value={dreamText}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_CONTENT_CHARACTERS) {
                  setDreamText(newValue);
                }
              }}
              onKeyDown={handleKeyPress}
              className="min-h-[200px] bg-card border-muted text-card-foreground placeholder:text-muted-foreground transition-magical resize-none text-left"
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-right">
              {dreamText.length} / {MAX_CONTENT_CHARACTERS}
            </p>
          </div>
          <div className="space-y-1">
            <Input
              placeholder="Dream title (optional)"
              value={dreamTitle}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_TITLE_CHARACTERS) {
                  setDreamTitle(newValue);
                }
              }}
              onKeyDown={handleKeyPress}
              className="bg-card border-muted text-card-foreground placeholder:text-muted-foreground transition-magical text-left"
            />
            <p className="text-xs text-muted-foreground text-right">
              {dreamTitle.length} / {MAX_TITLE_CHARACTERS}
            </p>
          </div>
          <div className="space-y-2">
          <Button
            onClick={handleTextSubmit}
            disabled={!dreamText.trim()}
            className="w-full bg-primary hover:bg-primary/90 transition-magical"
          >
            Save Dream
          </Button>
            <p className="text-xs text-muted-foreground">
              Tip: Press Cmd + Enter to save quickly
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};