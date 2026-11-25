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
    <section id="experience" ref={sectionRef} className="scroll-mt-20 bg-ink px-5 py-20 md:px-10 md:py-28">
      <div className="config-copy">
        <SectionLabel>06 — Configure</SectionLabel>
        <h2 className="text-display mt-6 text-[clamp(2.5rem,8vw,5rem)] text-warm">Compose Type-01</h2>
        <p className="mt-4 max-w-xl text-silver">
          Demo GLB with remapped materials — scroll to sweep the camera, drag to orbit, or use studio presets.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_min(100%,320px)] lg:gap-8">
        <Suspense
          fallback={<div className="h-[min(48svh,420px)] animate-pulse border border-graphite bg-charcoal lg:h-[min(60vh,560px)]" />}
        >
          <VehicleCanvas
            className="config-stage cinematic-frame h-[min(48svh,420px)] w-full min-h-[280px] border border-graphite bg-charcoal sm:h-[min(52vh,480px)] lg:h-[min(60vh,560px)]"
            dpr={1.5}
          />
        </Suspense>
        <ConfiguratorPanel className="lg:sticky lg:top-24 lg:self-start" />
      </div>
    </section>
  );
}