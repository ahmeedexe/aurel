import { ensureGsapPlugins, gsap } from "@/lib/gsap";
import type { ScrollTrigger } from "@/lib/gsap";

type ChapterOptions = {
  from: number;
  to: number;
  note?: string;
};

/** Restrained mono line reveal for major section boundaries. */
export function bindChapterTransition(root: HTMLElement, _opts: ChapterOptions): ScrollTrigger {
  ensureGsapPlugins();

  const line = root.querySelector<HTMLElement>(".chapter-line");
  const nums = root.querySelector<HTMLElement>(".chapter-nums");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top 92%",
      end: "top 62%",
      scrub: 0.45,
    },
  });

  if (nums) {
    tl.fromTo(nums, { opacity: 0.35, y: 8 }, { opacity: 1, y: 0, ease: "power2.out" }, 0);
  }
  if (line) {
    tl.fromTo(line, { scaleX: 0, opacity: 0.4 }, { scaleX: 1, opacity: 1, ease: "power2.out" }, 0.05);
  }

  return tl.scrollTrigger!;
}