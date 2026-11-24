import { useEffect, useState } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";

const STORAGE_KEY = "aurel-orbit-coach-dismissed";

type Props = {
  onDismiss?: () => void;
};

export function OrbitCoachmark({ onDismiss }: Props) {
  const fine = useFinePointer();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (fine) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    const id = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(id);
  }, [fine]);

  if (fine || !visible) return null;

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className="text-mono pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-4"
      role="status"
    >
      <p className="border border-graphite bg-ink/92 px-4 py-2 text-silver shadow-lg">
        DRAG TO ORBIT
        <button
          type="button"
          className="pointer-events-auto ml-3 text-signal underline"
          onClick={dismiss}
        >
          OK
        </button>
      </p>
    </div>
  );
}

export function dismissOrbitCoachmark() {
  sessionStorage.setItem(STORAGE_KEY, "1");
}