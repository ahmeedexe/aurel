import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/hooks/useFinePointer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type CursorMode = "default" | "interactive" | "orbit";

export function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 28 });
  const sy = useSpring(y, { stiffness: 380, damping: 28 });

  useEffect(() => {
    const root = document.documentElement;
    if (active) root.classList.add("custom-cursor");
    else root.classList.remove("custom-cursor");
    return () => root.classList.remove("custom-cursor");
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const resolveMode = (target: EventTarget | null): CursorMode => {
      if (!(target instanceof Element)) return "default";
      if (target.closest('[data-cursor="orbit"], canvas')) return "orbit";
      if (target.closest("a, button, [role='button'], [role='link'], input, textarea, select, label")) {
        return "interactive";
      }
      return "default";
    };

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      setMode(resolveMode(e.target));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [active, visible, x, y]);

  if (!active) return null;

  const ring =
    mode === "orbit"
      ? "size-12 border-signal/80 bg-signal/10"
      : mode === "interactive"
        ? "size-9 border-signal bg-transparent"
        : "size-6 border-warm/70 bg-warm/5";

  const dot =
    mode === "interactive" ? "size-0 opacity-0" : "size-1.5 bg-signal";

  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[10001]",
        !visible && "opacity-0"
      )}
      style={{ x: sx, y: sy }}
    >
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color] duration-200",
          ring
        )}
      >
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full", dot)} />
      </div>
    </motion.div>
  );
}