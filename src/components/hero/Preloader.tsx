import { useLayoutEffect, useRef, useState } from "react";
import { BrandRing } from "@/components/ui/BrandRing";
import { gsap } from "@/lib/gsap";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { onDone: () => void };

const BOOT_STEPS = [
  { threshold: 22, label: "Powertrain vector sync" },
  { threshold: 50, label: "Type-01 surface shaders" },
  { threshold: 76, label: "Studio lighting rig" },
  { threshold: 96, label: "Experience layer" },
] as const;

const RING_R = 52;
const RING_C = 2 * Math.PI * RING_R;

export function Preloader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const [pct, setPct] = useState(0);
  const [activeSteps, setActiveSteps] = useState(0);
  const doneCalled = useRef(false);

  useLayoutEffect(() => {
    if (!root.current) return;
    if (reduced) {
      onDone();
      return;
    }

    const counter = { v: 0 };
    const s = coarse ? 0.58 : 0.82;
    const fireBoot = () => {
      if (doneCalled.current) return;
      doneCalled.current = true;
      onDone();
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      tl.set(".pre-iris", { clipPath: "circle(120% at 50% 50%)" })
        .fromTo(".pre-glyph", { opacity: 0, scale: 1.08 }, { opacity: 0.12, scale: 1, duration: 0.55 * s })
        .fromTo(".pre-ring-wrap", { opacity: 0, rotate: -40 }, { opacity: 1, rotate: 0, duration: 0.5 * s }, "<0.1")
        .fromTo(".pre-core", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.45 * s }, "-=0.35")
        .to(".pre-ring-wrap", { rotate: coarse ? 120 : 160, duration: 0.95 * s, ease: "none" }, "-=0.15")
        .to(
          counter,
          {
            v: 100,
            duration: 0.95 * s,
            ease: "power2.inOut",
            onUpdate: () => {
              const n = Math.round(counter.v);
              setPct(n);
              setActiveSteps(BOOT_STEPS.filter((step) => n >= step.threshold).length);
            },
          },
          "-=0.95"
        )
        .fromTo(".pre-scan", { xPercent: -120 }, { xPercent: 120, duration: 0.38 * s, ease: "power2.out" }, "-=0.45")
        .call(fireBoot, [], "+=0.02")
        .to(".pre-flash", { opacity: 0.5, duration: 0.06, yoyo: true, repeat: 1 }, "<")
        .to(".pre-iris", { clipPath: "circle(0% at 50% 50%)", duration: 0.72 * s, ease: "power4.inOut" }, "<0.05")
        .to(".pre-word", { scale: 1.02, duration: 0.18, yoyo: true, repeat: 1 }, "<0.1")
        .to(root.current, { opacity: 0, duration: 0.28 * s, ease: "power2.out" }, "-=0.35");
    }, root);

    return () => ctx.revert();
  }, [coarse, onDone, reduced]);

  if (reduced) return null;

  const dashOffset = RING_C - (RING_C * pct) / 100;

  return (
    <div
      ref={root}
      className="pre-iris fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink"
      aria-hidden
    >
      <div className="pre-flash pointer-events-none absolute inset-0 bg-signal/20 opacity-0" />

      <p className="pre-glyph text-display pointer-events-none absolute text-[clamp(6rem,32vw,18rem)] text-warm/5">
        01
      </p>

      <div className="pre-ring-wrap relative flex size-56 items-center justify-center md:size-64">
        <BrandRing className="absolute size-full opacity-55" />
        <svg className="absolute size-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
          <circle cx="60" cy="60" r={RING_R} fill="none" stroke="#24272b" strokeWidth="1" />
          <circle
            cx="60"
            cy="60"
            r={RING_R}
            fill="none"
            stroke="#d62828"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-100"
          />
        </svg>
      </div>

      <div className="pre-core absolute flex flex-col items-center text-center">
        <p className="text-display pre-word text-[clamp(2.8rem,12vw,7rem)] tracking-[0.08em] text-warm">AUREL</p>
        <p className="text-mono mt-2 text-2xl text-warm tabular-nums md:text-3xl">
          {String(pct).padStart(3, "0")}
          <span className="text-signal">%</span>
        </p>
        <p className="text-mono mt-1 text-silver/90">Booting Type-01</p>

        {!coarse && (
          <ul className="mt-8 w-[min(92vw,320px)] space-y-2 text-left">
            {BOOT_STEPS.map((step, i) => (
              <li
                key={step.label}
                className="text-mono flex items-center gap-3 text-[0.6rem] transition-colors duration-300 md:text-[0.65rem]"
                style={{ color: i < activeSteps ? "#f0f0eb" : "rgba(197,200,204,0.35)" }}
              >
                <span
                  className="inline-block size-1.5 shrink-0 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: i < activeSteps ? "#d62828" : "#24272b" }}
                />
                {step.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pre-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-warm/12 to-transparent" />

      <p className="text-mono pointer-events-none absolute bottom-6 left-6 text-silver/50">SYS·AUREL / {new Date().getFullYear()}</p>
      <p className="text-mono pointer-events-none absolute right-6 bottom-6 text-silver/50">BEYOND THE DRIVE</p>
    </div>
  );
}