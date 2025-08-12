import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isTouchDevice: boolean;
  supportsHaptics: boolean;
}

export const useMobileDetection = (): MobileDetection => {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isAndroid: false,
    isIOS: false,
    isTouchDevice: false,
    supportsHaptics: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check for haptic feedback support
    const supportsHaptics = 'vibrate' in navigator || 
      ('hapticFeedback' in navigator) ||
      (isIOS && 'DeviceMotionEvent' in window);

    setDetection({
      isMobile,
      isAndroid,
      isIOS,
      isTouchDevice,
      supportsHaptics,
    });
  }, []);

  return detection;
};

// Haptic feedback utilities
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30]
    };
    navigator.vibrate(patterns[type]);
  }
};