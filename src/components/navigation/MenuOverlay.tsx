import { AnimatePresence, motion } from "motion/react";
import { NAV_ITEMS } from "@/data/specs";
import { useSound } from "@/context/SoundContext";

type Props = { open: boolean; onClose: () => void };

export function MenuOverlay({ open, onClose }: Props) {
  const { playTick } = useSound();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex h-full flex-col justify-between p-6 md:p-10">
            <motion.p
              className="text-display text-[clamp(3rem,12vw,9rem)] text-warm/10"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              AUREL
            </motion.p>
            <nav aria-label="Primary">
              <ul className="space-y-4 md:space-y-2">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.08 * i }}
                  >
                    <a
                      href={item.href}
                      className="text-display block text-[clamp(2.5rem,8vw,5.5rem)] text-warm hover:text-signal focus-visible:text-signal"
                      onClick={() => {
                        playTick();
                        onClose();
                      }}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              onClick={onClose}
              className="text-mono self-start border border-graphite px-4 py-2 text-silver hover:text-warm"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}