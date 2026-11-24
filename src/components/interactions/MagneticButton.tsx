import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/hooks/useFinePointer";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
};

export function MagneticButton({ children, className, href, onClick, variant = "primary" }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22 });
  const sy = useSpring(y, { stiffness: 260, damping: 22 });

  const base = cn(
    "inline-flex items-center justify-center gap-2 px-6 py-3 text-mono transition-colors",
    variant === "primary"
      ? "bg-signal text-warm hover:bg-signal/90"
      : "border border-graphite text-warm hover:border-silver/50"
  );

  const onMove = (e: React.MouseEvent) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.15);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.15);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const style = fine ? { x: sx, y: sy } : undefined;

  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        className={cn(base, className)}
        style={style}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn(base, className)}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}