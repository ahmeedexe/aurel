import { useLayoutEffect, useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ENGINEERING_STATS } from "@/data/specs";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Engineering() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!section.current || reduced) return;
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      ENGINEERING_STATS.forEach((_, i) => {
        const el = section.current?.querySelector(`[data-stat="${i}"]`);
        if (!el) return;
        const valueEl = el.querySelector(".stat-value");
        const target = parseFloat(ENGINEERING_STATS[i].value);
        if (!valueEl) return;
        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: target,
            ease: "power2.out",
            duration: 1.2,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
            onUpdate: () => {
              valueEl.textContent = Number.isInteger(target)
                ? String(Math.round(obj.val))
                : obj.val.toFixed(1);
            },
          }
        );
      });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="engineering" ref={section} className="bg-charcoal px-5 py-24 md:px-10 md:py-32">
      <SectionLabel>04 — Engineering</SectionLabel>
      <h2 className="text-display mt-6 max-w-3xl text-[clamp(2.2rem,6vw,4rem)] text-warm">
        Fiction, precisely measured
      </h2>
      <p className="text-mono mt-4 max-w-xl text-silver/80">All figures describe the AUREL Type-01 concept only.</p>
      <ul className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {ENGINEERING_STATS.map((stat, i) => (
          <li key={stat.label} data-stat={i} className="border-t border-graphite pt-6">
            <p className="text-mono text-silver">{stat.label}</p>
            <p className="text-display mt-2 text-5xl text-warm md:text-6xl">
              <span className="stat-value">{stat.value}</span>
              <span className="ml-1 text-2xl text-signal">{stat.unit}</span>
            </p>
            <p className="mt-2 text-sm text-silver/70">{stat.note}</p>
          </li>
        ))}
      </ul>
      <svg className="mt-16 w-full text-graphite" viewBox="0 0 800 120" aria-hidden>
        <path fill="none" stroke="currentColor" strokeWidth="1" d="M0 80 Q200 20 400 60 T800 40" />
        <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M0 100 Q250 60 500 90 T800 70" opacity="0.5" />
      </svg>
    </section>
  );
}