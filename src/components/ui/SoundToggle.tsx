import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/context/SoundContext";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "text-mono flex items-center gap-2 border border-graphite bg-charcoal/60 px-3 py-2 text-warm transition-colors hover:border-silver/40",
        className
      )}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute ambient sound" : "Enable ambient sound"}
    >
      {enabled ? <Volume2 size={14} aria-hidden /> : <VolumeX size={14} aria-hidden />}
      Sound {enabled ? "on" : "off"}
    </button>
  );
}