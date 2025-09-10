import { useState, useEffect, useRef } from 'react';

export function useScrollPreservation() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preserve scroll position when filters change
  const preserveScrollPosition = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollTop);
    }
  };

  // Restore scroll position after content updates
  useEffect(() => {
    if (containerRef.current && scrollPosition > 0) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return {
    containerRef,
    preserveScrollPosition
  };
}
