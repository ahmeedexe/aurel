import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useBlockContextMenu } from "@/hooks/useBlockContextMenu";
import { CustomCursor } from "@/components/interactions/CustomCursor";
import { Preloader } from "@/components/hero/Preloader";
import { Hero } from "@/components/hero/Hero";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ConfiguratorSection } from "@/components/sections/ConfiguratorSection";
import { DesignDetails } from "@/components/sections/DesignDetails";
import { Engineering } from "@/components/sections/Engineering";
import { Manifesto } from "@/components/sections/Manifesto";
import { PrivateExperience } from "@/components/sections/PrivateExperience";
import { TheDrive } from "@/components/sections/TheDrive";
import { MachineReel } from "@/components/sections/MachineReel";
import { ChapterBridge } from "@/components/ui/ChapterBridge";
import { FilmGrain } from "@/components/ui/FilmGrain";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function App() {
  useBlockContextMenu();
  const reduced = useReducedMotion();
  const [booted, setBooted] = useState(false);
  const onPreloaderDone = useCallback(() => setBooted(true), []);
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!footerRef.current || reduced) return;
    ensureGsapPlugins();
    const tween = gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#finale",
          start: "bottom 90%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  return (
    <LenisProvider>
      <a className="skip-link" href="#work">
        Skip to manifesto
      </a>
      <FilmGrain />
      <ScrollProgress />
      <CustomCursor />
      {!booted && <Preloader onDone={onPreloaderDone} />}
      <SiteHeader visible={booted} />
      <main>
        <Hero ready={booted} />
        <Manifesto />
        <ChapterBridge from={1} to={2} note="Manifesto → Machine" />
        <MachineReel />
        <ChapterBridge from={2} to={3} note="Machine → Macro" />
        <DesignDetails />
        <Engineering />
        <ChapterBridge from={4} to={5} note="Engineering → Drive" />
        <TheDrive />
        <ChapterBridge from={5} to={6} note="Drive → Compose" />
        <ConfiguratorSection />
        <PrivateExperience />
      </main>
      <footer
        ref={footerRef}
        className={cn(
          "flex flex-col gap-4 border-t border-graphite bg-ink px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10",
          reduced ? "opacity-100" : "opacity-0"
        )}
      >
        <p className="text-mono text-silver">© {new Date().getFullYear()} AUREL — fictional brand · FastSell portfolio</p>
        <SoundToggle className="self-start sm:hidden" />
      </footer>
    </LenisProvider>
  );
}