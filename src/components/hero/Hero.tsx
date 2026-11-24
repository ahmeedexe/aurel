import { ChevronDown } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { MagneticButton } from "@/components/interactions/MagneticButton";
import { BrandRing } from "@/components/ui/BrandRing";
import { ScrollTrigger, ensureGsapPlugins, gsap } from "@/lib/gsap";
import { IMAGES } from "@/lib/images";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { ready: boolean };

export function Hero({ ready }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!ready || !wrap.current || !pin.current || reduced) return;
    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".hero-bg", { opacity: 0 }, { opacity: 1, duration: 0.45 })
        .fromTo(".hero-mark", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.35")
        .fromTo(
          ".hero-mask",
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "power4.out" },
          "-=0.28"
        )
        .fromTo(".hero-line", { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.1 }, "-=0.55")
        .fromTo(".hero-sub", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.35")
        .fromTo(".hero-cta", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.28");

      ScrollTrigger.create({
        trigger: wrap.current,
        start: "top top",
        end: "+=130%",
        pin: pin.current,
        scrub: true,
      });

      gsap.to(".hero-vehicle img", {
        scale: 1.18,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-copy", {
        y: -80,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-glyph", {
        scale: 1.08,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <div ref={wrap} className="hero-bg relative h-[200vh]">
      <section
        ref={pin}
        className="relative flex h-[100svh] flex-col justify-end overflow-hidden bg-ink"
        aria-label="Introduction"
      >
        <p className="hero-glyph text-display pointer-events-none absolute right-[-6%] top-[8%] text-[clamp(8rem,28vw,22rem)] leading-none text-warm/5">
          A
        </p>
        <BrandRing className="hero-glyph pointer-events-none absolute right-[8%] top-[38%] hidden size-44 md:block" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_18%,#d6282822,transparent_45%),radial-gradient(ellipse_at_70%_80%,#24272b88,transparent_50%)]" />

        <figure className="hero-mask hero-vehicle absolute inset-0 md:left-[18%]" aria-hidden>
          <img
            src={IMAGES.heroVehicle}
            alt=""
            className="h-full w-full object-cover object-[62%_50%]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25 md:via-ink/55" />
          <div className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-ink to-transparent md:w-[38%]" />
        </figure>

        <div className="hero-copy relative z-10 grid gap-10 px-5 pb-14 pt-28 md:grid-cols-2 md:px-10 md:pb-20 md:pt-28">
          <div>
            <p className="hero-mark text-mono text-signal">AUREL · Type-01</p>
            <h1 className="text-display mt-6 overflow-hidden text-[clamp(3.8rem,12vw,9.5rem)] text-warm">
              <span className="hero-line block">BEYOND</span>
              <span className="hero-line block text-silver">THE DRIVE.</span>
            </h1>
            <p className="hero-sub text-editorial mt-6 max-w-sm text-xl text-silver md:text-2xl">
              Engineering emotion. Defining movement.
            </p>
            <div className="hero-cta mt-10 flex flex-wrap gap-4">
              <MagneticButton href="#machine">Explore the machine</MagneticButton>
              <MagneticButton href="#experience" variant="ghost">
                Configure
              </MagneticButton>
            </div>
          </div>
          <div className="hidden flex-col items-end justify-end md:flex" aria-hidden>
            <span className="text-mono text-silver/60">Scroll to enter</span>
            <ChevronDown className="mt-2 animate-bounce text-silver" size={20} />
          </div>
        </div>
      </section>
    </div>
  );
}