import { useState, useEffect } from "react";

interface ReadingProgressProps {
  targetRef?: React.RefObject<HTMLElement>;
}

const ReadingProgress = ({ targetRef }: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (targetRef?.current) {
        const element = targetRef.current;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        
        // Calculate how much of the article has been scrolled through
        const start = elementTop - windowHeight;
        const end = elementTop + elementHeight;
        const current = scrollTop;
        
        if (current <= start) {
          setProgress(0);
        } else if (current >= end) {
          setProgress(100);
        } else {
          const percentage = ((current - start) / (end - start)) * 100;
          setProgress(Math.min(100, Math.max(0, percentage)));
        }
      } else {
        // Fallback: use document height
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = (scrollTop / docHeight) * 100;
        setProgress(Math.min(100, Math.max(0, percentage)));
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [targetRef]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/50">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* Progress percentage indicator */}
      <div className="absolute right-4 top-2 text-xs text-muted-foreground font-medium bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-border/50">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default ReadingProgress;
