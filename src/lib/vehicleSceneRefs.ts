import type { VehicleSceneProbe } from "@/lib/probeVehicleScene";

/** Mutable scene handles (not React state) for per-frame systems. */
export const vehicleSceneRefs: {
  probe: VehicleSceneProbe | null;
  probeVersion: number;
} = {
  probe: null,
  probeVersion: 0,
};