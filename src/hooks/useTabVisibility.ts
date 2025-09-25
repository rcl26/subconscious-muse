import { useState, useEffect } from 'react';

export const useTabVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [hasBeenHidden, setHasBeenHidden] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      
      if (!visible) {
        setHasBeenHidden(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return {
    isVisible,
    hasBeenHidden,
    isReturningFromHidden: isVisible && hasBeenHidden
  };
};