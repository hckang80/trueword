'use client';

import { useEffect, useRef } from 'react';

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  enabled?: boolean;
}

export const InfiniteScrollTrigger = ({
  onIntersect,
  enabled = true
}: InfiniteScrollTriggerProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, enabled]);

  return <div ref={observerRef} />;
};
