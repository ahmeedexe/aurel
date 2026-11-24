import { MagneticButton } from "@/components/interactions/MagneticButton";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PrivateExperience() {
  return (
    <section className="grid bg-charcoal md:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-20 md:px-12 md:py-28">
        <SectionLabel>Invitation</SectionLabel>
        <h2 className="text-display mt-6 text-[clamp(2.5rem,7vw,4.5rem)] text-warm">Private atelier</h2>
        <p className="mt-6 max-w-md text-silver">
          AUREL experiences are appointment-only. This demo is a creative frontend study — not a commercial offer.
        </p>
        <MagneticButton href="mailto:info@usefastsell.com?subject=AUREL%20demo" className="mt-10">
          Discover AUREL
        </MagneticButton>
      </div>
      <div className="border-t border-graphite md:border-t-0 md:border-l">
        <ul className="text-mono divide-y divide-graphite text-silver">
          {["Geneva atelier", "Immersive configuration", "Track calibration", "Commission delivery"].map((line) => (
            <li key={line} className="px-5 py-6 md:px-10">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}