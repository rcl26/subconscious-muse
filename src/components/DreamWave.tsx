import React from 'react';

interface DreamWaveProps {
  className?: string;
  fullWidth?: boolean;
}

export const DreamWave: React.FC<DreamWaveProps> = ({ className = "", fullWidth = false }) => {
  const containerClass = fullWidth 
    ? "fixed inset-x-0 h-32 md:h-40 z-0 pointer-events-none"
    : `relative w-full h-24 md:h-32 overflow-hidden ${className}`;

  return (
    <div className={containerClass}>
      {/* Multi-layer wave SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Enhanced gradient definitions */}
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
            <stop offset="20%" stopColor="hsl(var(--accent))" stopOpacity="0.10" />
            <stop offset="40%" stopColor="hsl(var(--secondary))" stopOpacity="0.08" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
            <stop offset="80%" stopColor="hsl(var(--accent))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
          </linearGradient>
          
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.04" />
            <stop offset="33%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="66%" stopColor="hsl(var(--accent))" stopOpacity="0.06" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.04" />
          </linearGradient>
          
          <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.12" />
            <stop offset="50%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.12" />
          </linearGradient>

          <animateTransform id="waveAnim1" attributeName="transform" type="translate" values="0,0;50,0;0,0" dur="8s" repeatCount="indefinite"/>
          <animateTransform id="waveAnim2" attributeName="transform" type="translate" values="0,0;-30,0;0,0" dur="12s" repeatCount="indefinite"/>
        </defs>

        {/* Primary theta wave layer - gentle, rolling hills */}
        <path
          d="M-100,80 Q150,60 400,80 Q650,100 900,80 Q1150,60 1400,80 L1400,140 L-100,140 Z"
          fill="url(#waveGradient1)"
          stroke="url(#waveStroke)"
          strokeWidth="1.5"
          className="animate-pulse"
        >
          <animateTransform attributeName="transform" type="translate" values="0,0;150,0;0,0" dur="14s" repeatCount="indefinite"/>
        </path>
        
        {/* Secondary theta wave layer - harmonious rhythm */}
        <path
          d="M-150,90 Q200,70 500,90 Q800,110 1100,90 Q1400,70 1700,90"
          fill="none"
          stroke="url(#waveStroke)"
          strokeWidth="1"
          strokeOpacity="0.15"
          className="animate-pulse"
          style={{ animationDelay: '0.5s' }}
        >
          <animateTransform attributeName="transform" type="translate" values="0,0;-120,0;0,0" dur="18s" repeatCount="indefinite"/>
        </path>

        {/* Tertiary theta wave layer - subtle meditative flow */}
        <path
          d="M-200,70 Q100,55 400,70 Q700,85 1000,70 Q1300,55 1600,70"
          fill="none"
          stroke="url(#waveGradient2)"
          strokeWidth="2"
          strokeOpacity="0.1"
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        >
          <animateTransform attributeName="transform" type="translate" values="0,0;180,0;0,0" dur="22s" repeatCount="indefinite"/>
        </path>
      </svg>

      {/* Enhanced floating dream particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Constellation particles */}
        <div className="absolute top-4 left-[8%] w-1 h-1 bg-primary-foreground/20 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-8 left-[20%] w-0.5 h-0.5 bg-accent/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-6 left-[35%] w-1 h-1 bg-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-10 left-[50%] w-0.5 h-0.5 bg-primary/25 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-5 left-[65%] w-1 h-1 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute top-9 left-[80%] w-0.5 h-0.5 bg-primary-foreground/25 rounded-full animate-pulse" style={{ animationDelay: '2.3s' }}></div>
        <div className="absolute top-7 right-[10%] w-1 h-1 bg-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1.8s' }}></div>
        
        {/* Bottom particles */}
        <div className="absolute bottom-8 left-[15%] w-0.5 h-0.5 bg-primary-foreground/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-6 left-[30%] w-1 h-1 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-10 left-[45%] w-0.5 h-0.5 bg-accent/25 rounded-full animate-pulse" style={{ animationDelay: '2.8s' }}></div>
        <div className="absolute bottom-7 left-[60%] w-1 h-1 bg-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute bottom-9 left-[75%] w-0.5 h-0.5 bg-primary-foreground/25 rounded-full animate-pulse" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute bottom-5 right-[8%] w-1 h-1 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>

        {/* Connecting lines for constellation effect */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="8" y1="20" x2="20" y2="40" stroke="hsl(var(--primary-foreground))" strokeWidth="0.1" opacity="0.08" className="animate-pulse" style={{ animationDelay: '4s' }}/>
          <line x1="35" y1="30" x2="50" y2="50" stroke="hsl(var(--accent))" strokeWidth="0.1" opacity="0.06" className="animate-pulse" style={{ animationDelay: '5s' }}/>
          <line x1="65" y1="25" x2="80" y2="45" stroke="hsl(var(--secondary))" strokeWidth="0.1" opacity="0.08" className="animate-pulse" style={{ animationDelay: '6s' }}/>
        </svg>
      </div>
    </div>
  );
};