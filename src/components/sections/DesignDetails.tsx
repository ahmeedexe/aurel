import { useLayoutEffect, useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IMAGES } from "@/lib/images";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const items = [
  { src: IMAGES.details.headlight, label: "Matrix headlamp", wide: true },
  { src: IMAGES.details.carbon, label: "Carbon torsion spine" },
  { src: IMAGES.details.wheel, label: "Forged turbine wheel" },
  { src: IMAGES.details.interior, label: "Cockpit materials" },
];

export function DesignDetails() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!root.current || !track.current || reduced) return;
    ensureGsapPlugins();

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const tween = gsap.to(track.current, {
        x: () => -(track.current!.scrollWidth - window.innerWidth + 48),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          start: "top top",
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

  return (
    <section ref={root} className="relative bg-ink" aria-labelledby="details-title">
      <div className="px-5 pt-24 pb-10 md:px-10 md:pt-28">
        <SectionLabel>03 — Design details</SectionLabel>
        <h2 id="details-title" className="text-display mt-6 text-[clamp(2.5rem,7vw,5rem)] text-warm">
          Macro study
        </h2>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-24 md:hidden">
        {items.map((item) => (
          <figure key={item.label} className="relative min-h-[50svh] overflow-hidden border border-graphite">
            <img src={item.src} alt={item.label} className="h-full w-full object-cover" loading="lazy" />
            <figcaption className="text-mono absolute bottom-0 left-0 bg-ink/80 p-3 text-silver">{item.label}</figcaption>
          </figure>
        ))}
      </div>

      <div ref={track} className="hidden w-max gap-3 px-5 pb-24 md:flex md:px-10">
        {items.map((item) => (
          <figure
            key={item.label}
            className={`group relative h-[min(62vh,520px)] overflow-hidden border border-graphite ${
              item.wide ? "w-[min(88vw,720px)]" : "w-[min(70vw,420px)]"
            }`}
          >
            <img
              src={item.src}
              alt={item.label}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <figcaption className="text-mono absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-4 text-silver">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}