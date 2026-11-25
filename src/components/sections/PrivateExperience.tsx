import { useLayoutEffect, useRef } from "react";
import { MagneticButton } from "@/components/interactions/MagneticButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function PrivateExperience() {
  const wrap = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!wrap.current || !section.current || reduced) return;
    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      const pin = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "+=100%",
          pin: section.current,
          scrub: 0.72,
        },
      });

      pin.fromTo(".finale-eol", { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.015, ease: "power2.inOut" }, 0.38)
        .fromTo(
          ".finale-eol-bg",
          { opacity: 1 },
          { opacity: 0, ease: "power2.inOut" },
          0.38
        )
        .fromTo(
          ".finale-body",
          { opacity: 0, y: 56, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out" },
          0.44
        )
        .fromTo(
          ".finale-word",
          { yPercent: 118, opacity: 0.12 },
          { yPercent: 0, opacity: 1, stagger: 0.11, ease: "power3.out" },
          0.52
        );

      gsap.fromTo(
        ".finale-rest",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: wrap.current,
            start: "72% top",
            end: "bottom top",
            scrub: 0.45,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={wrap} className="relative h-[195vh]">
      <section
        id="finale"
        ref={section}
        className="finale-vignette relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-charcoal"
      >
        <div className="finale-eol-bg pointer-events-none absolute inset-0 z-20 bg-ink" aria-hidden />
        <div className="finale-eol pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-mono text-silver/70">TYPE-01 · Demo mesh</p>
          <p className="text-display mt-4 text-[clamp(3.2rem,13vw,8.5rem)] leading-[0.82] text-warm">END OF LINE</p>
          <div className="mt-8 h-px w-[min(72vw,420px)] origin-center bg-gradient-to-r from-transparent via-signal/80 to-transparent" />
          <p className="text-mono mt-6 text-silver/55">Studio offline</p>
        </div>

        <div className={cn("finale-body", reduced ? "opacity-100" : "opacity-0")}>
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center px-5 py-20 md:px-12 md:py-28">
              <SectionLabel>07 — Coda</SectionLabel>
              <h2 className="text-display mt-6 overflow-hidden text-[clamp(2.8rem,9vw,5.5rem)] text-warm">
                <span className="finale-word block">SILENCE</span>
                <span className="finale-word block text-signal">AT SPEED.</span>
              </h2>
              <p className="finale-rest mt-6 max-w-md text-silver">
                AUREL experiences are appointment-only. This demo is a creative frontend study — not a commercial offer.
              </p>
              <MagneticButton
                href="mailto:info@usefastsell.com?subject=AUREL%20demo"
                className="finale-rest mt-10"
              >
                Discover AUREL
              </MagneticButton>
            </div>
            <div className="finale-rest border-t border-graphite md:border-t-0 md:border-l">
              <ul className="text-mono divide-y divide-graphite text-silver">
                {["Geneva atelier", "Immersive configuration", "Track calibration", "Commission delivery"].map((line) => (
                  <li key={line} className="px-5 py-6 md:px-10">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}