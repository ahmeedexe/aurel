import { useLayoutEffect, useRef } from "react";
import { VehicleCanvas } from "@/components/scenes/VehicleCanvas";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IMAGES } from "@/lib/images";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function TheMachine() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!section.current || reduced) return;
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".machine-shot",
        { clipPath: "inset(0 45% 0 0)", scale: 1.08 },
        {
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top 60%", end: "center center", scrub: 1 },
        }
      );
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="machine" ref={section} className="bg-charcoal px-5 py-24 md:px-10 md:py-28">
      <div className="grid-editorial items-center">
        <div>
          <SectionLabel>02 — The Machine</SectionLabel>
          <h2 className="text-display mt-6 text-[clamp(2.5rem,7vw,5rem)] text-warm">Type-01</h2>
          <p className="mt-6 max-w-md text-silver">
            Industrial design treated as sculpture. The abstract Type-01 form below is procedural geometry — an honest
            stand-in until a licensed mesh is available.
          </p>
          <VehicleCanvas className="mt-10 h-[min(52vh,420px)] w-full border border-graphite bg-ink" dpr={1.25} />
        </div>
        <figure className="machine-shot relative min-h-[320px] overflow-hidden">
          <img src={IMAGES.machine} alt="Side profile of AUREL Type-01 concept" className="h-full w-full object-cover" loading="lazy" />
          <figcaption className="text-mono absolute bottom-4 left-4 bg-ink/70 px-2 py-1 text-silver">
            Monocoque shell · 47 composite panels
          </figcaption>
        </figure>
      </div>
    </section>
  );
}