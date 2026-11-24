import { useConfigurator } from "@/context/ConfiguratorContext";
import { IMAGES } from "@/lib/images";

export function VehicleFallback({ className }: { className?: string }) {
  const { paintHex, lightAccent } = useConfigurator();

  return (
    <div className={className} role="img" aria-label="AUREL Type-01 still — WebGL unavailable">
      <img src={IMAGES.heroVehicle} alt="" className="h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-color"
        style={{ backgroundColor: paintHex, opacity: 0.45 }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${lightAccent}33, transparent 55%)`,
        }}
      />
      <p className="text-mono absolute bottom-3 left-3 border border-graphite bg-ink/80 px-2 py-1 text-silver">
        Still render · enable WebGL for 3D sculpture
      </p>
    </div>
  );
}