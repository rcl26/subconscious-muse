import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Square, CheckCircle, AlertCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InlineVoiceRecorderProps {
  onDreamRecorded: (dreamText: string, title?: string) => void;
  onCancel: () => void;
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'transcribed' | 'error';

export const InlineVoiceRecorder = ({ onDreamRecorded, onCancel }: InlineVoiceRecorderProps) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcribedText, setTranscribedText] = useState('');
  const [title, setTitle] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Auto-start recording when component mounts
    startRecording();
    
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

  if (recordingState === 'transcribed') {
    return (
      <div className="space-y-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Dream Recorded</h3>
          <Button onClick={onCancel} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="inline-title" className="text-sm font-medium">
              Title (optional)
            </Label>
            <Input
              id="inline-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your dream a title..."
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Transcribed Dream</Label>
            <div className="min-h-[80px] p-3 bg-background/50 border rounded-md">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {transcribedText}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleSave} className="flex-1">
              Save Dream
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {recordingState === 'recording' && (
            <Button
              onClick={stopRecording}
              variant="destructive"
              size="sm"
              className="rounded-full h-10 w-10 p-0"
            >
              <Square className="h-4 w-4" />
            </Button>
          )}
          
          {recordingState === 'processing' && (
            <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          
          {recordingState === 'error' && (
            <Button
              onClick={startRecording}
              variant="outline"
              size="sm"
              className="rounded-full h-10 w-10 p-0"
            >
              <AlertCircle className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {recordingState === 'recording' && `Recording... ${formatTime(recordingTime)}`}
              {recordingState === 'processing' && 'Transcribing...'}
              {recordingState === 'error' && 'Try Again'}
            </span>
            {recordingState === 'recording' && (
              <span className="text-xs text-muted-foreground">Tap to stop recording</span>
            )}
          </div>
        </div>
        
        <Button onClick={onCancel} variant="ghost" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Recording visualization */}
      {recordingState === 'recording' && (
        <div className="flex justify-center items-center space-x-1 mt-2">
          {[0, 1, 2, 3, 4].map((i) => (
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
  );
};