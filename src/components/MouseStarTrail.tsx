import { useEffect, useRef, useCallback } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  element: HTMLDivElement | null;
}

export const MouseStarTrail = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const lastMoveTimeRef = useRef(0);
  const isActiveRef = useRef(false);

  // Check if device has mouse (not touch-only)
  const hasMouseDevice = useRef(
    typeof window !== 'undefined' && 
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  // Initialize star pool
  const initializeStars = useCallback(() => {
    if (!containerRef.current || !hasMouseDevice.current) return;

    const stars: Star[] = [];
    const starCount = 5;

    for (let i = 0; i < starCount; i++) {
      const starElement = document.createElement('div');
      starElement.className = 'star-trail absolute pointer-events-none will-change-transform';
      starElement.style.cssText = `
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 50%, transparent 100%);
        border-radius: 50%;
        box-shadow: 0 0 6px hsl(var(--primary) / 0.6), 0 0 12px hsl(var(--primary) / 0.3);
        opacity: 0;
        transform: translate3d(0, 0, 0) scale(0);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 30;
      `;
      
      containerRef.current.appendChild(starElement);

      stars.push({
        id: i,
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0,
        element: starElement
      });
    }

    starsRef.current = stars;
  }, []);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!hasMouseDevice.current) return;

    const now = performance.now();
    if (now - lastMoveTimeRef.current < 16) return; // 60fps throttle
    
    lastMoveTimeRef.current = now;
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    if (!isActiveRef.current) {
      isActiveRef.current = true;
      animateStars();
    }
  }, []);

  // Animate stars following mouse
  const animateStars = useCallback(() => {
    if (!containerRef.current || !isActiveRef.current || !hasMouseDevice.current) return;

    const stars = starsRef.current;
    const { x, y } = mousePositionRef.current;

    stars.forEach((star, index) => {
      if (!star.element) return;

      const delay = index * 100; // Stagger delay for trail effect
      const targetScale = Math.random() * 0.5 + 0.5; // Random size variation
      
      setTimeout(() => {
        if (!star.element || !isActiveRef.current) return;

        // Position star at mouse location with slight random offset
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;
        
        star.element.style.transform = `translate3d(${x + offsetX}px, ${y + offsetY}px, 0) scale(${targetScale})`;
        star.element.style.opacity = '0.8';

        // Fade out after a delay
        setTimeout(() => {
          if (star.element) {
            star.element.style.opacity = '0';
            star.element.style.transform = `translate3d(${x + offsetX}px, ${y + offsetY}px, 0) scale(0)`;
          }
        }, 600);
      }, delay);
    });

    animationFrameRef.current = requestAnimationFrame(() => {
      if (isActiveRef.current) {
        animateStars();
      }
    });
  }, []);

  // Debounced stop animation
  const stopAnimation = useCallback(() => {
    const timeout = setTimeout(() => {
      isActiveRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!hasMouseDevice.current) return;

    initializeStars();

    // Add event listeners with passive flag for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', stopAnimation);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', stopAnimation);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Cleanup star elements
      if (containerRef.current) {
        starsRef.current.forEach(star => {
          if (star.element && star.element.parentNode) {
            star.element.parentNode.removeChild(star.element);
          }
        });
      }
    };
  }, [handleMouseMove, stopAnimation, initializeStars]);

  // Don't render on touch devices
  if (!hasMouseDevice.current) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ 
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    />
  );
};