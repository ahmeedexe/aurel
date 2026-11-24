import { useLayoutEffect, useRef } from "react";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!bar.current || reduced) return;
    ensureGsapPlugins();
    const tween = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.15,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div className="fixed top-0 left-0 z-[90] h-px w-full origin-left bg-graphite" aria-hidden>
      <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-signal" />
    </div>
  );
}