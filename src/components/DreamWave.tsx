import React from 'react';

interface DreamWaveProps {
  className?: string;
}

export const DreamWave: React.FC<DreamWaveProps> = ({ className = "" }) => {
  return (
    <div className={`relative w-full h-24 md:h-32 overflow-hidden ${className}`}>
      {/* Wave SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="25%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="75%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
          
          <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Main wave path */}
        <path
          d="M0,40 Q100,10 200,40 T400,40 L400,80 L0,80 Z"
          fill="url(#waveGradient)"
          stroke="url(#waveStroke)"
          strokeWidth="1"
          className="animate-pulse"
        />
        
        {/* Secondary wave for depth */}
        <path
          d="M0,50 Q100,20 200,50 T400,50"
          fill="none"
          stroke="url(#waveStroke)"
          strokeWidth="1"
          strokeOpacity="0.3"
          className="animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
      </svg>

      {/* Floating dream particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-8 w-1 h-1 bg-primary-foreground/30 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-8 left-20 w-0.5 h-0.5 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-6 right-16 w-1 h-1 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-8 left-32 w-0.5 h-0.5 bg-primary-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-6 right-8 w-1 h-1 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      </div>
    </div>
  );
};