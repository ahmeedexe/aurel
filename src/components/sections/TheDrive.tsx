import { useLayoutEffect, useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IMAGES } from "@/lib/images";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function TheDrive() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!section.current || reduced) return;
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".drive-img",
        { scale: 1.18, xPercent: -4 },
        {
          scale: 1,
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} className="relative min-h-[90svh] overflow-hidden bg-ink">
      <img
        src={IMAGES.drive}
        alt="Night drive light trails"
        className="drive-img absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="relative z-10 flex min-h-[90svh] flex-col justify-end px-5 pb-20 md:px-10">
        <SectionLabel>05 — The drive</SectionLabel>
        <h2 className="text-display mt-4 text-[clamp(2.5rem,8vw,5rem)] text-warm">Horizon dissolves</h2>
        <p className="text-editorial mt-4 max-w-lg text-2xl text-silver">
          Sound-off by default. Enable for a low studio hum and subtle UI feedback.
        </p>
      </div>
    </section>
  );
}