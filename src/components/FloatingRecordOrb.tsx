import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecordingState = 'idle' | 'recording' | 'processing' | 'transcribed' | 'error';

interface FloatingRecordOrbProps {
  state: RecordingState;
  audioLevel: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const FloatingRecordOrb = ({ 
  state, 
  audioLevel, 
  onStartRecording, 
  onStopRecording 
}: FloatingRecordOrbProps) => {
  const getOrbClasses = () => {
    const baseClasses = "relative w-32 h-32 rounded-full transition-all duration-500 ease-out transform";
    
    switch (state) {
      case 'idle':
        return `${baseClasses} bg-gradient-to-br from-primary/20 to-accent/30 hover:from-primary/30 hover:to-accent/40 hover:scale-105 shadow-dream`;
      case 'recording':
        return `${baseClasses} bg-gradient-to-br from-red-500/30 to-pink-500/40 shadow-lg shadow-red-500/20`;
      case 'processing':
        return `${baseClasses} bg-gradient-to-br from-blue-500/30 to-purple-500/40 shadow-lg shadow-blue-500/20`;
      case 'error':
        return `${baseClasses} bg-gradient-to-br from-red-600/30 to-red-800/40 shadow-lg shadow-red-600/20`;
      default:
        return `${baseClasses} bg-gradient-to-br from-primary/20 to-accent/30`;
    }
  };

  const getInnerOrbClasses = () => {
    const scale = state === 'recording' ? 1 + (audioLevel * 0.3) : 1;
    return `absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 transition-transform duration-100 transform scale-${Math.floor(scale * 100)}`;
  };

  const getRippleClasses = () => {
    if (state !== 'recording') return "hidden";
    return "absolute inset-0 rounded-full border border-white/20 animate-ping [animation-duration:3s]";
  };

  const getIconElement = () => {
    switch (state) {
      case 'recording':
        return <Square className="w-8 h-8 text-white fill-current" />;
      case 'processing':
        return <Loader2 className="w-8 h-8 text-white animate-spin" />;
      case 'error':
        return <Mic className="w-8 h-8 text-red-200" />;
      default:
        return <Mic className="w-8 h-8 text-white" />;
    }
  };

  const handleClick = () => {
    if (state === 'idle') {
      onStartRecording();
    } else if (state === 'recording') {
      onStopRecording();
    }
  };

  const isClickable = state === 'idle' || state === 'recording';

  return (
    <div className="relative">
      {/* Subtle floating particles around orb */}
      {state === 'recording' && (
        <>
          <div className="absolute -top-3 -right-5 w-1 h-1 bg-white/30 rounded-full animate-bounce [animation-duration:4s]" style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-2 -left-4 w-1 h-1 bg-white/25 rounded-full animate-bounce [animation-duration:3s]" style={{ animationDelay: '2s' }} />
        </>
      )}

      {/* Main orb container */}
      <Button
        onClick={handleClick}
        disabled={!isClickable}
        className={`${getOrbClasses()} p-0 border-0 disabled:opacity-100`}
        asChild
      >
        <div>
          {/* Subtle ripple effect for recording */}
          <div className={getRippleClasses()} />
          
          {/* Inner orb with dynamic scaling */}
          <div 
            className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 transition-transform duration-100"
            style={{ 
              transform: state === 'recording' ? `scale(${1 + (audioLevel * 0.2)})` : 'scale(1)' 
            }}
          />
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {getIconElement()}
          </div>
          
          {/* Subtle glow effects */}
          {state === 'idle' && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/20 animate-pulse [animation-duration:3s]" />
          )}
          {state === 'recording' && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/15" />
          )}
        </div>
      </Button>
      
    </div>
  );
};