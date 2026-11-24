import { lazy, Suspense } from "react";
import { ConfiguratorPanel } from "@/components/configurator/ConfiguratorPanel";
import { SectionLabel } from "@/components/ui/SectionLabel";

const VehicleCanvas = lazy(() =>
  import("@/components/scenes/VehicleCanvas").then((m) => ({ default: m.VehicleCanvas }))
);

export function ConfiguratorSection() {
  return (
    <section id="experience" className="scroll-mt-20 bg-ink px-5 py-24 md:px-10 md:py-28">
      <SectionLabel>06 — Configure</SectionLabel>
      <h2 className="text-display mt-6 text-[clamp(2.5rem,8vw,5rem)] text-warm">Compose Type-01</h2>
      <p className="mt-4 max-w-xl text-silver">
        Every control remaps materials and studio light in real time. Orbit the sculpture — paint is not a filter, it is
        the body.
      </p>
      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Suspense
          fallback={<div className="h-[min(60vh,520px)] animate-pulse border border-graphite bg-charcoal" />}
        >
          <VehicleCanvas className="h-[min(60vh,520px)] w-full border border-graphite bg-charcoal" dpr={1.5} />
        </Suspense>
        <ConfiguratorPanel />
      </div>
    </section>
  );
}