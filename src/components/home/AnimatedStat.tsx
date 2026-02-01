import { useState, useEffect, useRef } from "react";

interface AnimatedStatProps {
  value: string;
  label: string;
}

function parseStatValue(value: string): { number: number; suffix: string } {
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

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function AnimatedStat({ value, label }: AnimatedStatProps) {
  const { number: endValue, suffix } = parseStatValue(value);
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const startTime = performance.now();
    let frameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * endValue);
      
      setCount(currentValue);
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isVisible, endValue]);

  return (
    <div
      ref={ref}
      className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-border/50"
    >
      <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
        {formatNumber(count)}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
