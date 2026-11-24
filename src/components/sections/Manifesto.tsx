import { useLayoutEffect, useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Manifesto() {
  const wrap = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!wrap.current || !section.current || reduced) return;
    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mani-word",
        { yPercent: 100, opacity: 0.15 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: "+=90%",
            pin: section.current,
            scrub: 0.8,
          },
        }
      );

      gsap.fromTo(
        ".mani-body",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: wrap.current,
            start: "center center",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={wrap} className="relative h-[160vh]">
      <section
        id="work"
        ref={section}
        className="flex h-[100svh] flex-col justify-center bg-ink px-5 md:px-10"
      >
        <SectionLabel>01 — Manifesto</SectionLabel>
        <h2 className="text-display mt-8 text-[clamp(3.5rem,12vw,9rem)] leading-[0.82] text-warm">
          <span className="mani-word block overflow-hidden">DESIGNED TO</span>
          <span className="mani-word block overflow-hidden text-signal">MOVE YOU.</span>
        </h2>
        <p className="mani-body text-editorial mt-10 max-w-xl text-2xl text-silver md:text-[1.65rem]">
          AUREL is not transportation. It is a calibrated instrument — chassis, light, and silence composed as one
          continuum.
        </p>
      </section>
    </div>
  );
}