import { useState, useRef } from "react";
import { Mic, Square, Play, Pause, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DreamRecorderProps {
  onDreamRecorded: (dreamText: string) => void;
}

export const DreamRecorder = ({ onDreamRecorded }: DreamRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [dreamText, setDreamText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      // Ensure we record for at least 1 second to get meaningful audio
      const minRecordingTime = 1000; // 1 second
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          toast({
            title: "Recording Error",
            description: "No audio data captured. Please try recording again.",
            variant: "destructive",
          });
          setIsTranscribing(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Check if audio blob is meaningful size (at least 1KB)
        if (audioBlob.size < 1000) {
          toast({
            title: "Recording Too Short",
            description: "Please record for at least 2-3 seconds for better transcription.",
            variant: "destructive",
          });
          setIsTranscribing(false);
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        // Convert to base64 and transcribe
        await transcribeAudio(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording in chunks for better quality
      mediaRecorderRef.current.start(100); // 100ms chunks
      setIsRecording(true);
      
      console.log("Recording started...");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Record data in chunks every 100ms for better quality  
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunkSize = 0x8000; // 32KB chunks
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      const base64Audio = btoa(binary);
      
      console.log("Sending audio for transcription...");
      
      // Call our edge function
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.text) {
        console.log("Transcription successful:", data.text);
        onDreamRecorded(data.text);
        
        toast({
          title: "Dream Recorded ✨",
          description: "Your voice has been transcribed successfully!",
        });
      } else {
        throw new Error("No transcription received");
      }
      
    } catch (error) {
      console.error("Transcription error:", error);
      toast({
        title: "Transcription Failed",
        description: "Unable to convert speech to text. Please try typing your dream instead.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const togglePlayback = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
        audio.onended = () => setIsPlaying(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTextSubmit = () => {
    if (dreamText.trim()) {
      onDreamRecorded(dreamText.trim());
      setDreamText("");
    }
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

        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 border border-primary/20">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Type
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-6 mt-6">
            <div className="flex justify-center">
              <div className="relative">
                {!isRecording && !isTranscribing ? (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="h-24 w-24 rounded-full bg-primary hover:bg-primary/90 shadow-float transition-magical"
                  >
                    <Mic className="h-8 w-8" />
                  </Button>
                ) : isTranscribing ? (
                  <Button
                    size="lg"
                    className="h-24 w-24 rounded-full bg-muted cursor-not-allowed"
                    disabled
                  >
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
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
                <div className="text-sm text-muted-foreground">Recording your dream...</div>
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

            {isTranscribing && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Converting speech to text...</div>
                <div className="flex justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              </div>
            )}

            {recordedAudio && !isRecording && !isTranscribing && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Dream recorded and transcribed!</p>
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
          </TabsContent>

          <TabsContent value="text" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Describe your dream in as much detail as you can remember..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                className="min-h-[200px] bg-background/50 border-primary/20 focus:border-primary/40 transition-magical resize-none"
              />
              <Button
                onClick={handleTextSubmit}
                disabled={!dreamText.trim()}
                className="w-full bg-primary hover:bg-primary/90 transition-magical"
              >
                Save Dream
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};