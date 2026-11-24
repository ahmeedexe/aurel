import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { ConfiguratorPanel } from "@/components/configurator/ConfiguratorPanel";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const VehicleCanvas = lazy(() =>
  import("@/components/scenes/VehicleCanvas").then((m) => ({ default: m.VehicleCanvas }))
);

export function ConfiguratorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!sectionRef.current || reduced) return;
    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".config-stage",
        { clipPath: "inset(10% 14% 10% 14%)", opacity: 0.72 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            end: "top 32%",
            scrub: 0.65,
          },
        }
      );
      gsap.fromTo(
        ".config-copy",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="experience" ref={sectionRef} className="scroll-mt-20 bg-ink px-5 py-24 md:px-10 md:py-28">
      <div className="config-copy">
        <SectionLabel>06 — Configure</SectionLabel>
        <h2 className="text-display mt-6 text-[clamp(2.5rem,8vw,5rem)] text-warm">Compose Type-01</h2>
        <p className="mt-4 max-w-xl text-silver">
          Scroll to sweep the studio camera — then drag to take the wheel. Paint, wheels, cabin, and HDR lighting remap
          the GLB in real time.
        </p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Suspense
          fallback={<div className="h-[min(60vh,520px)] animate-pulse border border-graphite bg-charcoal" />}
        >
          <VehicleCanvas
            className="config-stage cinematic-frame h-[min(60vh,520px)] w-full border border-graphite bg-charcoal"
            dpr={1.5}
          />
        </Suspense>
        <ConfiguratorPanel />
      </div>
    </section>
  );
}