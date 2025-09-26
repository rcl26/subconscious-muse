import React from 'react';

interface GeometricBracketsProps {
  children: React.ReactNode;
  className?: string;
}

export const GeometricBrackets: React.FC<GeometricBracketsProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Top-left bracket */}
      <div className="absolute -top-2 -left-2 w-4 h-4 pointer-events-none">
        <svg viewBox="0 0 16 16" className="w-full h-full">
          <path
            d="M0,8 L0,0 L8,0"
            fill="none"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1"
            strokeOpacity="0.3"
            className="transition-all duration-300 group-hover:stroke-opacity-60"
          />
        </svg>
      </div>

      {/* Top-right bracket */}
      <div className="absolute -top-2 -right-2 w-4 h-4 pointer-events-none">
        <svg viewBox="0 0 16 16" className="w-full h-full">
          <path
            d="M16,8 L16,0 L8,0"
            fill="none"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1"
            strokeOpacity="0.3"
            className="transition-all duration-300 group-hover:stroke-opacity-60"
          />
        </svg>
      </div>

      {/* Bottom-left bracket */}
      <div className="absolute -bottom-2 -left-2 w-4 h-4 pointer-events-none">
        <svg viewBox="0 0 16 16" className="w-full h-full">
          <path
            d="M0,8 L0,16 L8,16"
            fill="none"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1"
            strokeOpacity="0.3"
            className="transition-all duration-300 group-hover:stroke-opacity-60"
          />
        </svg>
      </div>

      {/* Bottom-right bracket */}
      <div className="absolute -bottom-2 -right-2 w-4 h-4 pointer-events-none">
        <svg viewBox="0 0 16 16" className="w-full h-full">
          <path
            d="M16,8 L16,16 L8,16"
            fill="none"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1"
            strokeOpacity="0.3"
            className="transition-all duration-300 group-hover:stroke-opacity-60"
          />
        </svg>
      </div>

      {children}
    </div>
  );
};