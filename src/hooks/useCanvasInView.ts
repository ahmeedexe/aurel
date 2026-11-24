import { useEffect, useRef, useState } from "react";

/** Pauses expensive WebGL loops when the canvas wrapper is off-screen. */
export function useCanvasInView<T extends HTMLElement>(rootMargin = "120px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, rootMargin, threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}