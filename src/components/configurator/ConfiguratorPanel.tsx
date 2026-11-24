import { INTERIORS, LIGHTING, PAINTS, WHEELS } from "@/data/config";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { useVehicleCamera } from "@/context/VehicleCameraContext";
import { CAMERA_PRESETS, type CameraPresetId } from "@/lib/cameraPresets";
import { useSound } from "@/context/SoundContext";
import { cn } from "@/lib/utils";

function OptionGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  const { playTick } = useSound();

  return (
    <div>
      <p className="text-mono mb-3 text-silver">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const swatch = "hex" in opt ? (opt as { hex: string }).hex : null;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                playTick();
                onChange(opt.id);
              }}
              className={cn(
                "text-mono inline-flex items-center gap-2 border px-3 py-2 text-xs transition-colors",
                value === opt.id
                  ? "border-signal bg-signal/15 text-warm"
                  : "border-graphite text-silver hover:border-silver/40"
              )}
              aria-pressed={value === opt.id}
            >
              {swatch && (
                <span
                  className="size-3 shrink-0 border border-warm/20 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]"
                  style={{ backgroundColor: swatch }}
                  aria-hidden
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const CAMERA_ORDER: CameraPresetId[] = ["front", "profile", "cabin"];

export function ConfiguratorPanel() {
  const cfg = useConfigurator();
  const { playTick } = useSound();
  const { preset, setPreset } = useVehicleCamera();

  const paintLabel = PAINTS.find((p) => p.id === cfg.paint)!.label;
  const wheelLabel = WHEELS.find((p) => p.id === cfg.wheels)!.label;
  const interiorLabel = INTERIORS.find((p) => p.id === cfg.interior)!.label;
  const lightLabel = LIGHTING.find((p) => p.id === cfg.lighting)!.label;

  return (
    <aside className="border border-graphite bg-charcoal/80 p-5 backdrop-blur-md md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-mono text-signal">Configurator</p>
          <p className="text-editorial mt-1 text-2xl text-warm">Type-01</p>
        </div>
        <button
          type="button"
          className="text-mono border border-graphite px-3 py-2 text-silver hover:text-warm"
          onClick={() => {
            playTick();
            cfg.reset();
            setPreset(null);
          }}
        >
          Reset
        </button>
      </div>

      <div className="mb-6 border border-graphite bg-ink/60 px-4 py-3">
        <p className="text-mono text-signal">Your Type-01</p>
        <p className="text-mono mt-2 text-[0.65rem] leading-relaxed text-warm">
          {paintLabel} · {wheelLabel} · {interiorLabel} · {lightLabel}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-mono mb-3 text-silver">Camera</p>
        <div className="grid grid-cols-3 gap-2">
          {CAMERA_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                playTick();
                setPreset(preset === id ? null : id);
              }}
              className={cn(
                "text-mono border px-2 py-2 text-[0.6rem] transition-colors",
                preset === id
                  ? "border-signal bg-signal/15 text-warm"
                  : "border-graphite text-silver hover:border-silver/40"
              )}
              aria-pressed={preset === id}
              title={CAMERA_PRESETS[id].hint}
            >
              {CAMERA_PRESETS[id].label.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="text-mono mt-2 text-[0.58rem] text-silver/60">Cabin — exterior windshield framing only.</p>
      </div>

      <div className="space-y-6">
        <OptionGroup title="Exterior" options={PAINTS} value={cfg.paint} onChange={cfg.setPaint} />
        <OptionGroup title="Wheels" options={WHEELS} value={cfg.wheels} onChange={cfg.setWheels} />
        <OptionGroup title="Interior" options={INTERIORS} value={cfg.interior} onChange={cfg.setInterior} />
        <OptionGroup title="Lighting" options={LIGHTING} value={cfg.lighting} onChange={cfg.setLighting} />
      </div>
    </aside>
  );
}