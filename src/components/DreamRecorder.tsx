import { useState } from "react";
import { PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
    <Card className="p-8 bg-gradient-dream shadow-dream border-0">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <PenTool className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary">Record Your Dream</h2>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Dream title (optional)"
            value={dreamTitle}
            onChange={(e) => setDreamTitle(e.target.value)}
            className="bg-background/50 border-primary/20 focus:border-primary/40 transition-magical text-left"
          />
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
            disabled={!dreamText.trim()}
            className="glass-pill bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground font-semibold px-8 py-3 shadow-premium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ripple"></div>
            <PenTool className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Save Dream</span>
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