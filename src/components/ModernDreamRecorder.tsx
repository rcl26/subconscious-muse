import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AudioVisualizer } from "./AudioVisualizer";
import { FloatingRecordOrb } from "./FloatingRecordOrb";
import { triggerHapticFeedback } from "@/hooks/useMobileDetection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type RecordingState = 'idle' | 'recording' | 'processing' | 'transcribed' | 'error';

interface ModernDreamRecorderProps {
  onDreamRecorded: (dreamText: string, title?: string) => void;
  onCancel?: () => void;
}

export const ModernDreamRecorder = ({ onDreamRecorded, onCancel }: ModernDreamRecorderProps) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [transcribedText, setTranscribedText] = useState("");
  const [title, setTitle] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const analyzeAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
    setAudioLevel(average / 255); // Normalize to 0-1
    
    if (recordingState === 'recording') {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        setRecordingState('processing');
        transcribeAudio();
      };

      mediaRecorderRef.current.start();
      setRecordingState('recording');
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start audio analysis
      analyzeAudio();
      
      triggerHapticFeedback('light');
      toast("Recording started! Speak your dream...");
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingState('error');
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      
      // Stop timer and audio analysis
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Stop all tracks
      const tracks = mediaRecorderRef.current.stream?.getTracks() || [];
      tracks.forEach(track => track.stop());
      
      triggerHapticFeedback('medium');
      setAudioLevel(0);
    }
  };

  const transcribeAudio = async () => {
    try {
      if (audioChunksRef.current.length === 0) {
        throw new Error('No audio data recorded');
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          
          const { data, error } = await supabase.functions.invoke('transcribe-audio', {
            body: { audio: base64Audio }
          });

          if (error) throw error;

          setTranscribedText(data.text);
          setRecordingState('transcribed');
          toast.success("Dream transcribed successfully!");
          
        } catch (error) {
          console.error('Transcription error:', error);
          setRecordingState('error');
          toast.error("Failed to transcribe audio");
        }
      };
      
      reader.readAsDataURL(audioBlob);
      
    } catch (error) {
      console.error('Error in transcription:', error);
      setRecordingState('error');
      toast.error("Failed to process recording");
    }
  };

  const handleSave = () => {
    if (transcribedText.trim()) {
      onDreamRecorded(transcribedText.trim(), title.trim() || undefined);
      // Reset state
      setTranscribedText("");
      setTitle("");
      setRecordingState('idle');
      setRecordingTime(0);
    }
  };

  const handleCancel = () => {
    // Reset state
    setTranscribedText("");
    setTitle("");
    setRecordingState('idle');
    setRecordingTime(0);
    setAudioLevel(0);
    
    // Stop any ongoing recording
    if (mediaRecorderRef.current && recordingState === 'recording') {
      stopRecording();
    }
    
    onCancel?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Transcribed state - show editing interface
  if (recordingState === 'transcribed') {
    return (
      <Card className="p-8 bg-card shadow-dream border-0 backdrop-blur-sm">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Your Dream Has Been Captured
            </h3>
            <p className="text-muted-foreground">
              Review and edit before saving
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                placeholder="Dream title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-card border-muted text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div>
              <Textarea
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                className="min-h-[200px] bg-card border-muted text-card-foreground resize-none"
                placeholder="Your transcribed dream will appear here..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={!transcribedText.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 transition-magical"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Dream
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="px-6"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Main recording interface
  return (
    <Card className="p-8 bg-card shadow-dream border-0 backdrop-blur-sm overflow-hidden relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute top-12 right-8 w-1 h-1 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-primary/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <div className="text-center space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-card-foreground">
              Capture Your Dream
            </h2>
            <p className="text-muted-foreground">
              {recordingState === 'idle' && "Tap the orb to start recording"}
              {recordingState === 'recording' && "Listening to your dream..."}
              {recordingState === 'processing' && "Transcribing your dream..."}
              {recordingState === 'error' && "Something went wrong"}
            </p>
          </div>

          {/* Main Recording Orb */}
          <div className="relative flex justify-center">
            <FloatingRecordOrb
              state={recordingState}
              audioLevel={audioLevel}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
            />
          </div>

          {/* Audio Visualizer */}
          {(recordingState === 'recording' || recordingState === 'processing') && (
            <div className="flex justify-center">
              <AudioVisualizer 
                audioLevel={audioLevel} 
                isRecording={recordingState === 'recording'}
              />
            </div>
          )}

          {/* Recording Timer */}
          {recordingState === 'recording' && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-lg font-mono text-card-foreground">
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {recordingState === 'error' && (
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setRecordingState('idle')}
                variant="outline"
              >
                Try Again
              </Button>
              {onCancel && (
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}

          {recordingState === 'processing' && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Processing your dream...</span>
              </div>
            </div>
          )}

          {/* Quick tips */}
          {recordingState === 'idle' && (
            <div className="text-xs text-muted-foreground max-w-md mx-auto">
              <p>💡 Speak clearly and take your time. The app will automatically transcribe your voice into text.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};