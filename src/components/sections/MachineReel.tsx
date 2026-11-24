import { useLayoutEffect, useRef } from "react";
import { MagneticButton } from "@/components/interactions/MagneticButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IMAGES } from "@/lib/images";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function ShortSpecPanel() {
  return (
    <div className="flex h-full min-h-[70svh] w-full flex-col justify-center gap-10 px-8 md:min-w-[50vw] md:px-16">
      <p className="text-mono text-silver">Technical index</p>
      <ul className="space-y-6">
        {[
          ["Chassis", "Carbon-aluminium hybrid"],
          ["Torque vector", "Quad-motor AWD"],
          ["Aero mode", "Active blade suite"],
          ["Mass", "1,890 kg (concept)"],
        ].map(([k, v]) => (
          <li key={k} className="flex flex-wrap items-baseline justify-between gap-4 border-b border-graphite pb-4">
            <span className="text-mono text-silver">{k}</span>
            <span className="text-display text-3xl text-warm">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MachineReel() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!root.current || !track.current || reduced) return;
    ensureGsapPlugins();

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const tween = gsap.to(track.current, {
        x: () => -(track.current!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          end: () => `+=${track.current!.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [reduced]);

  const slides = [
    <div key="intro" className="flex h-full min-h-[70svh] min-w-full flex-col justify-center border-b border-graphite px-8 md:min-w-[55vw] md:border-r md:border-b-0 md:px-16">
      <SectionLabel>02 — The machine</SectionLabel>
      <h2 className="text-display mt-8 text-[clamp(3rem,9vw,7rem)] text-warm">TYPE-01</h2>
      <p className="text-editorial mt-8 max-w-md text-2xl text-silver">
        Monocoque as monument. Every line is load-bearing — visually and structurally.
      </p>
    </div>,
    <figure key="profile" className="relative h-full min-h-[55svh] min-w-full overflow-hidden md:min-w-[70vw]">
      <img src={IMAGES.machine} alt="AUREL Type-01 profile" className="h-full w-full object-cover" />
      <figcaption className="text-mono absolute bottom-8 left-8 bg-ink/80 px-3 py-2 text-silver">
        Torsion spine · forged aluminium
      </figcaption>
    </figure>,
    <div
      key="sculpt"
      className="flex h-full min-h-[70svh] min-w-full flex-col justify-center gap-6 border-y border-graphite bg-ink px-6 md:min-w-[65vw] md:border-x md:border-y-0 md:px-10"
    >
      <p className="text-mono text-signal">Type-01 · GLB</p>
      <p className="text-editorial max-w-lg text-2xl text-silver">
        The live mesh runs once in Compose — orbit, paint, wheels, cabin, and studio lighting share a single WebGL
        context (no duplicate scene load).
      </p>
      <figure className="relative mt-2 h-[min(40vh,360px)] overflow-hidden border border-graphite">
        <img src={IMAGES.heroVehicle} alt="" className="h-full w-full object-cover opacity-70" loading="lazy" />
        <figcaption className="text-mono absolute bottom-3 left-3 bg-ink/85 px-3 py-2 text-silver">
          Reference frame · interactive GLB in chapter 06
        </figcaption>
      </figure>
      <MagneticButton href="#experience" className="self-start">
        Open configurator
      </MagneticButton>
    </div>,
    <ShortSpecPanel key="spec" />,
  ];

  return (
    <section id="machine" ref={root} className="relative bg-charcoal">
      <div
        ref={track}
        className="flex h-auto w-full flex-col md:h-[108svh] md:w-max md:flex-row md:flex-nowrap md:items-stretch"
      >
        {slides.map((slide) => (
          <div key={slide.key} className="shrink-0 md:h-full">
            {slide}
          </div>
        ))}
      </div>
    </section>
  );
}