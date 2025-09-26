import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Square, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceRecorderProps {
  onDreamRecorded: (dreamText: string, title?: string) => void;
  onCancel?: () => void;
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'transcribed' | 'error';

export const VoiceRecorder = ({ onDreamRecorded, onCancel }: VoiceRecorderProps) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcribedText, setTranscribedText] = useState('');
  const [title, setTitle] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setRecordingState('processing');
        await transcribeAudio();
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setRecordingState('error');
      toast({
        title: "Microphone Access Error",
        description: "Please allow microphone access to record your dream.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const transcribeAudio = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio to base64');
        }

        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });

        if (error) {
          throw error;
        }

        if (data && data.text) {
          setTranscribedText(data.text);
          setRecordingState('transcribed');
        } else {
          throw new Error('No transcription received');
        }
      };
    } catch (error) {
      console.error('Transcription error:', error);
      setRecordingState('error');
      toast({
        title: "Transcription Error",
        description: "Failed to transcribe your recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (transcribedText.trim()) {
      onDreamRecorded(transcribedText, title.trim() || undefined);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateDisplay = () => {
    switch (recordingState) {
      case 'idle':
        return {
          icon: <Mic className="h-6 w-6" />,
          text: "Start Recording",
          action: startRecording,
          variant: "default" as const,
          disabled: false
        };
      case 'recording':
        return {
          icon: <Square className="h-6 w-6" />,
          text: `Recording... ${formatTime(recordingTime)}`,
          action: stopRecording,
          variant: "destructive" as const,
          disabled: false
        };
      case 'processing':
        return {
          icon: <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin" />,
          text: "Processing...",
          action: () => {},
          variant: "secondary" as const,
          disabled: true
        };
      case 'transcribed':
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          text: "Ready to Save",
          action: () => {},
          variant: "secondary" as const,
          disabled: true
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-6 w-6" />,
          text: "Try Again",
          action: () => setRecordingState('idle'),
          variant: "outline" as const,
          disabled: false
        };
    }
  };

  const stateDisplay = getStateDisplay();

  return (
    <div className="space-y-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Record Your Dream</h2>
        
        {/* Recording Button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            onClick={stateDisplay.action}
            variant={stateDisplay.variant}
            size="lg"
            disabled={stateDisplay.disabled}
            className="h-16 w-16 rounded-full p-0"
          >
            {stateDisplay.icon}
          </Button>
          <p className="text-sm text-muted-foreground">{stateDisplay.text}</p>
        </div>

        {/* Recording visualization */}
        {recordingState === 'recording' && (
          <div className="flex justify-center items-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 bg-destructive rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transcribed text display and editing */}
      {recordingState === 'transcribed' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title (optional)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your dream a title..."
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Transcribed Dream</Label>
            <div className="min-h-[100px] p-3 bg-background/50 border rounded-md">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {transcribedText}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleSave} className="flex-1">
              Save Dream
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Cancel button for other states */}
      {recordingState !== 'transcribed' && onCancel && (
        <div className="text-center">
          <Button onClick={onCancel} variant="ghost" size="sm">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};