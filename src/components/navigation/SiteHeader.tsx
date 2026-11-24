import { Menu, X } from "lucide-react";
import { useState } from "react";
import { MenuOverlay } from "@/components/navigation/MenuOverlay";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { cn } from "@/lib/utils";

export function SiteHeader({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 transition-opacity duration-700 md:px-10",
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <a href="#" className="text-mono text-warm tracking-[0.35em]">
          AUREL
        </a>
        <nav aria-label="Section shortcuts" className="hidden gap-8 lg:flex">
          {["#work", "#machine", "#engineering", "#experience"].map((href, i) => (
            <a key={href} href={href} className="text-mono text-silver hover:text-warm">
              {["Work", "Machine", "Engineering", "Experience"][i]}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SoundToggle className="hidden sm:flex" />
          <button
            type="button"
            className="border border-graphite p-2 text-warm hover:border-silver/50"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}