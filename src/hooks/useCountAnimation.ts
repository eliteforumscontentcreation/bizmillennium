import { useState, useEffect, useRef } from "react";

interface UseCountAnimationOptions {
  duration?: number;
  startOnMount?: boolean;
}

export function useCountAnimation(
  endValue: number,
  options: UseCountAnimationOptions = {}
) {
  const { duration = 2000, startOnMount = true } = options;
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!startOnMount || hasStarted) return;
    
    setHasStarted(true);
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * endValue);
      
      setCount(currentValue);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [endValue, duration, startOnMount, hasStarted]);

  return count;
}

// Helper to parse stat values like "14,000+" into a number
export function parseStatValue(value: string): { number: number; suffix: string } {
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^(\d+)(.*)$/);
  
  if (match) {
    return {
      number: parseInt(match[1], 10),
      suffix: match[2] || "",
    };
  }
  
  return { number: 0, suffix: value };
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
