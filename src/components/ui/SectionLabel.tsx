import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return <span className={cn("text-mono text-silver/80", className)}>{children}</span>;
}