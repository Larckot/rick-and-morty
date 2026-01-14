import { useEffect, useRef, RefObject } from 'react';

interface UseIntersectionOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

interface UseIntersectionReturn {
  ref: RefObject<HTMLDivElement | null>;
}

export function useIntersection(
  callback: () => void,
  options: UseIntersectionOptions = {}
): UseIntersectionReturn {
  const { threshold = 0.1, root = null, rootMargin = '0px' } = options;
  const observerTarget = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const currentTarget = observerTarget.current;
    if (!currentTarget) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      {
        threshold,
        root: root || null,
        rootMargin,
      }
    );

    observerRef.current.observe(currentTarget);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [callback, threshold, root, rootMargin]);

  return { ref: observerTarget };
}
