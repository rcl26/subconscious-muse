import { useState } from "react";
import { Mic, Square, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DreamRecorderProps {
  onDreamRecorded: (dreamText: string) => void;
}

export const DreamRecorder = ({ onDreamRecorded }: DreamRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    // Placeholder: Real voice recording will go here
    console.log("Starting dream recording...");
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Placeholder: Stop recording and generate mock transcript
    const mockDreamText = "I was flying over a vast ocean, feeling incredibly peaceful. The water was crystal clear and I could see dolphins swimming below me. There was a sense of freedom and lightness, like all my worries had disappeared.";
    setRecordedAudio("mock-audio-url");
    onDreamRecorded(mockDreamText);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Placeholder: Audio playback will go here
  };

  return (
    <Card className="p-8 bg-gradient-dream shadow-dream border-0">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">Record Your Dream</h2>
          <p className="text-muted-foreground">
            Take a moment to capture the essence of your dream while it's still fresh
          </p>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="h-24 w-24 rounded-full bg-primary hover:bg-primary/90 shadow-float transition-magical"
                disabled={isRecording}
              >
                <Mic className="h-8 w-8" />
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                className="h-24 w-24 rounded-full bg-destructive hover:bg-destructive/90 shadow-float transition-magical animate-pulse"
              >
                <Square className="h-8 w-8" />
              </Button>
            )}
          </div>
        </div>

        {isRecording && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Recording...</div>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: Math.random() * 20 + 10,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {recordedAudio && !isRecording && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Dream recorded successfully!</p>
            <Button
              onClick={togglePlayback}
              variant="outline"
              className="bg-background/50 border-primary/20 hover:bg-primary/10 transition-magical"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Playback
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Play Recording
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};