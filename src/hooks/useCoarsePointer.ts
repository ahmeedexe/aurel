import { useFinePointer } from "@/hooks/useFinePointer";
import { useEffect, useState } from "react";

export function useCoarsePointer() {
  const fine = useFinePointer();
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(!fine || mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [fine]);

  return coarse;
}