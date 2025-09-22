import { useState, useEffect } from 'react';

interface UseProgressiveImageProps {
  src: string;
  fallbackSrc?: string;
  placeholder?: string;
}

export const useProgressiveImage = ({ 
  src, 
  fallbackSrc, 
  placeholder 
}: UseProgressiveImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    // Create image object for preloading
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setLoading(false);
    };
    
    img.onerror = () => {
      if (fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      }
      setError(true);
      setLoading(false);
    };
    
    // Start loading the image
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return { src: currentSrc, loading, error };
};