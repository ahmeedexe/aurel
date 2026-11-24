import { useLayoutEffect, useRef } from "react";
import { bindChapterTransition } from "@/lib/chapterTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  from: number;
  to: number;
  note?: string;
};

export function ChapterBridge({ from, to, note }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (!root.current || reduced) return;
    const st = bindChapterTransition(root.current, { from, to, note });
    return () => {
      st.kill();
    };
  }, [from, to, note, reduced]);

  const fromLabel = String(from).padStart(2, "0");
  const toLabel = String(to).padStart(2, "0");

  return (
    <div ref={root} className="chapter-bridge border-y border-graphite/80 bg-ink px-5 py-6 md:px-10">
      <p className="chapter-nums text-mono text-silver/55">
        CHAPTER {fromLabel} → {toLabel}
        {note ? ` · ${note}` : ""}
      </p>
      <div className="chapter-line mt-4 h-px w-full origin-left scale-x-0 bg-signal/70" aria-hidden />
    </div>
  );
}