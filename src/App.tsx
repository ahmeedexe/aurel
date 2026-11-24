import { useCallback, useState } from "react";
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
import { FilmGrain } from "@/components/ui/FilmGrain";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SoundToggle } from "@/components/ui/SoundToggle";

export default function App() {
  useBlockContextMenu();
  const [booted, setBooted] = useState(false);
  const onPreloaderDone = useCallback(() => setBooted(true), []);

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
        <MachineReel />
        <DesignDetails />
        <Engineering />
        <TheDrive />
        <ConfiguratorSection />
        <PrivateExperience />
      </main>
      <footer className="flex flex-col gap-4 border-t border-graphite bg-ink px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="text-mono text-silver">© {new Date().getFullYear()} AUREL — fictional brand · FastSell portfolio</p>
        <SoundToggle className="self-start sm:hidden" />
      </footer>
    </LenisProvider>
  );
}