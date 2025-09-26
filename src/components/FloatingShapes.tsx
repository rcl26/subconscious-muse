import React from 'react';

interface FloatingShapesProps {
  className?: string;
}

export const FloatingShapes: React.FC<FloatingShapesProps> = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Floating triangles */}
      <div className="absolute top-1/5 left-1/12 w-3 h-3 opacity-15 animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}>
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-primary/30"></div>
      </div>
      
      <div className="absolute top-2/5 right-1/6 w-4 h-4 opacity-20 animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }}>
        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-accent/30"></div>
      </div>
      
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 opacity-25 animate-pulse" style={{ animationDelay: '4s', animationDuration: '5s' }}>
        <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-secondary/40"></div>
      </div>

      {/* Floating circles */}
      <div className="absolute top-1/3 left-3/4 w-6 h-6 rounded-full border border-primary-foreground/10 opacity-15 animate-pulse" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
      
      <div className="absolute bottom-1/3 right-1/5 w-4 h-4 rounded-full border border-accent/15 opacity-20 animate-pulse" style={{ animationDelay: '3s', animationDuration: '5s' }}></div>
      
      <div className="absolute top-3/5 left-1/8 w-5 h-5 rounded-full border border-secondary/12 opacity-18 animate-pulse" style={{ animationDelay: '5s', animationDuration: '8s' }}></div>

      {/* Floating hexagons */}
      <div className="absolute top-1/6 right-1/3 w-8 h-8 opacity-12 animate-pulse" style={{ animationDelay: '6s', animationDuration: '9s' }}>
        <div className="w-8 h-8 bg-primary/10 transform rotate-45"></div>
      </div>
      
      <div className="absolute bottom-1/5 left-2/3 w-6 h-6 opacity-15 animate-pulse" style={{ animationDelay: '8s', animationDuration: '6s' }}>
        <div className="w-6 h-6 bg-accent/12 transform rotate-45"></div>
      </div>

      {/* Floating lines */}
      <div className="absolute top-1/4 left-1/2 w-20 h-px bg-gradient-to-r from-transparent via-primary-foreground/8 to-transparent transform rotate-12 opacity-20 animate-pulse" style={{ animationDelay: '7s', animationDuration: '10s' }}></div>
      
      <div className="absolute bottom-2/5 right-1/4 w-16 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent transform -rotate-12 opacity-18 animate-pulse" style={{ animationDelay: '9s', animationDuration: '8s' }}></div>
      
      <div className="absolute top-3/5 left-1/5 w-12 h-px bg-gradient-to-r from-transparent via-secondary/12 to-transparent transform rotate-45 opacity-15 animate-pulse" style={{ animationDelay: '11s', animationDuration: '7s' }}></div>

      {/* Breathing geometric shapes */}
      <div className="absolute top-1/8 right-1/8 w-10 h-10 opacity-8">
        <div className="w-full h-full border border-primary-foreground/5 transform rotate-45 animate-pulse" style={{ animationDelay: '12s', animationDuration: '15s' }}></div>
      </div>
      
      <div className="absolute bottom-1/8 left-1/8 w-8 h-8 opacity-10">
        <div className="w-full h-full border border-accent/8 rounded-full animate-pulse" style={{ animationDelay: '14s', animationDuration: '12s' }}></div>
      </div>

      {/* Drifting particles */}
      <div className="absolute top-2/5 left-4/5 w-1 h-1 bg-primary-foreground/20 rounded-full opacity-30">
        <div className="w-full h-full animate-pulse" style={{ animationDelay: '16s', animationDuration: '4s' }}></div>
      </div>
      
      <div className="absolute bottom-3/5 right-3/5 w-1.5 h-1.5 bg-accent/25 rounded-full opacity-25">
        <div className="w-full h-full animate-pulse" style={{ animationDelay: '18s', animationDuration: '6s' }}></div>
      </div>
      
      <div className="absolute top-4/5 left-1/3 w-0.5 h-0.5 bg-secondary/30 rounded-full opacity-35">
        <div className="w-full h-full animate-pulse" style={{ animationDelay: '20s', animationDuration: '5s' }}></div>
      </div>
    </div>
  );
};