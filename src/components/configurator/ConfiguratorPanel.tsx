import { INTERIORS, LIGHTING, PAINTS, WHEELS } from "@/data/config";
import { useConfigurator } from "@/context/ConfiguratorContext";
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
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              playTick();
              onChange(opt.id);
            }}
            className={cn(
              "text-mono border px-3 py-2 text-xs transition-colors",
              value === opt.id
                ? "border-signal bg-signal/15 text-warm"
                : "border-graphite text-silver hover:border-silver/40"
            )}
            aria-pressed={value === opt.id}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ConfiguratorPanel() {
  const cfg = useConfigurator();
  const { playTick } = useSound();

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
          }}
        >
          Reset
        </button>
      </div>
      <div className="space-y-6">
        <OptionGroup title="Exterior" options={PAINTS} value={cfg.paint} onChange={cfg.setPaint} />
        <OptionGroup title="Wheels" options={WHEELS} value={cfg.wheels} onChange={cfg.setWheels} />
        <OptionGroup title="Interior" options={INTERIORS} value={cfg.interior} onChange={cfg.setInterior} />
        <OptionGroup title="Lighting" options={LIGHTING} value={cfg.lighting} onChange={cfg.setLighting} />
      </div>
      <p className="text-mono mt-6 text-silver/70">Procedural sculpture — materials update in real time.</p>
    </aside>
  );
}