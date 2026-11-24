import { IMAGES } from "@/lib/images";

type Props = {
  className?: string;
  reason?: "webgl" | "error";
};

export function VehicleFallback({ className, reason = "webgl" }: Props) {
  const copy =
    reason === "error"
      ? "3D scene failed to load — showing reference still."
      : "WebGL unavailable on this device — showing reference still.";

  return (
    <div className={className} role="img" aria-label="AUREL Type-01 reference still">
      <img src={IMAGES.heroVehicle} alt="" className="h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <p className="text-mono absolute bottom-3 left-3 max-w-[min(90%,320px)] border border-graphite bg-ink/90 px-3 py-2 text-silver">
        {copy}
      </p>
    </div>
  );
}