import React from 'react';

interface GeometricOverlayProps {
  className?: string;
}

export const GeometricOverlay: React.FC<GeometricOverlayProps> = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Corner accent lines */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40">
        <div className="absolute top-4 left-4 w-12 h-0.5 bg-gradient-to-r from-primary-foreground/20 to-transparent"></div>
        <div className="absolute top-4 left-4 w-0.5 h-12 bg-gradient-to-b from-primary-foreground/20 to-transparent"></div>
        <div className="absolute top-8 left-8 w-8 h-0.5 bg-gradient-to-r from-accent/15 to-transparent transform rotate-45"></div>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40">
        <div className="absolute top-4 right-4 w-12 h-0.5 bg-gradient-to-l from-primary-foreground/20 to-transparent"></div>
        <div className="absolute top-4 right-4 w-0.5 h-12 bg-gradient-to-b from-primary-foreground/20 to-transparent"></div>
        <div className="absolute top-8 right-8 w-8 h-0.5 bg-gradient-to-l from-secondary/15 to-transparent transform -rotate-45"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40">
        <div className="absolute bottom-4 left-4 w-12 h-0.5 bg-gradient-to-r from-primary-foreground/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 w-0.5 h-12 bg-gradient-to-t from-primary-foreground/20 to-transparent"></div>
        <div className="absolute bottom-8 left-8 w-8 h-0.5 bg-gradient-to-r from-accent/15 to-transparent transform -rotate-45"></div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40">
        <div className="absolute bottom-4 right-4 w-12 h-0.5 bg-gradient-to-l from-primary-foreground/20 to-transparent"></div>
        <div className="absolute bottom-4 right-4 w-0.5 h-12 bg-gradient-to-t from-primary-foreground/20 to-transparent"></div>
        <div className="absolute bottom-8 right-8 w-8 h-0.5 bg-gradient-to-l from-secondary/15 to-transparent transform rotate-45"></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Triangle */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 opacity-10">
          <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-primary-foreground animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Hexagon */}
        <div className="absolute top-3/4 right-1/4 w-6 h-6 opacity-15">
          <div className="w-6 h-6 bg-accent/20 transform rotate-45 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Diamond */}
        <div className="absolute top-1/2 left-1/6 w-3 h-3 opacity-20">
          <div className="w-3 h-3 bg-secondary/30 transform rotate-45 animate-pulse" style={{ animationDelay: '6s' }}></div>
        </div>
        
        {/* Lines */}
        <div className="absolute top-1/3 right-1/3 w-16 h-0.5 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent transform rotate-12 animate-pulse" style={{ animationDelay: '8s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-12 h-0.5 bg-gradient-to-r from-transparent via-accent/15 to-transparent transform -rotate-12 animate-pulse" style={{ animationDelay: '10s' }}></div>
      </div>

      {/* Constellation network */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="constellationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Constellation lines */}
        <line x1="10" y1="15" x2="25" y2="30" stroke="url(#constellationGradient)" strokeWidth="0.1" className="animate-pulse" style={{ animationDelay: '1s' }}/>
        <line x1="25" y1="30" x2="40" y2="20" stroke="url(#constellationGradient)" strokeWidth="0.1" className="animate-pulse" style={{ animationDelay: '3s' }}/>
        <line x1="60" y1="25" x2="75" y2="35" stroke="url(#constellationGradient)" strokeWidth="0.1" className="animate-pulse" style={{ animationDelay: '5s' }}/>
        <line x1="75" y1="35" x2="85" y2="20" stroke="url(#constellationGradient)" strokeWidth="0.1" className="animate-pulse" style={{ animationDelay: '7s' }}/>
        <line x1="20" y1="70" x2="35" y2="80" stroke="url(#constellationGradient)" strokeWidth="0.1" className="animate-pulse" style={{ animationDelay: '9s' }}/>
        <line x1="65" y1="75" x2="80" y2="65" stroke="url(#constellationGradient)" strokeWidth="0.1" className="animate-pulse" style={{ animationDelay: '11s' }}/>
      </svg>
    </div>
  );
};