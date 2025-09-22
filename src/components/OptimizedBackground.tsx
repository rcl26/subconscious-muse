import { useState, useEffect } from 'react';

interface OptimizedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const OptimizedBackground = ({ children, className = "" }: OptimizedBackgroundProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Preload the cosmic background image
    const img = new Image();
    
    img.onload = () => {
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      setImageError(true);
    };
    
    // Try to load WebP first, fallback to PNG
    const webpSrc = '/cosmic-background.webp';
    const pngSrc = '/cosmic-background.png';
    
    // Check if browser supports WebP
    const canvas = document.createElement('canvas');
    const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    img.src = webpSupported ? webpSrc : pngSrc;
  }, []);

  // CSS-only cosmic background as immediate fallback
  const cssBackground = `
    linear-gradient(
      135deg,
      hsl(var(--background)) 0%,
      hsl(245 60% 15%) 20%,
      hsl(260 80% 10%) 40%,
      hsl(280 70% 8%) 60%,
      hsl(245 50% 12%) 80%,
      hsl(var(--background)) 100%
    ),
    radial-gradient(
      ellipse at 20% 20%,
      hsl(270 70% 55% / 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      hsl(280 60% 45% / 0.12) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 50% 10%,
      hsl(260 80% 60% / 0.08) 0%,
      transparent 40%
    )
  `;

  const backgroundStyle = {
    background: cssBackground,
    ...(imageLoaded && !imageError && {
      backgroundImage: `url(/cosmic-background.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }),
    transition: 'background-image 0.8s ease-out',
  };

  return (
    <div 
      className={`min-h-screen overflow-hidden relative ${className}`}
      style={backgroundStyle}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Loading state with subtle animation */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-secondary/5 animate-pulse"></div>
      )}
      
      {children}
    </div>
  );
};