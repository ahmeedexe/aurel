import type { VehicleFitMetrics } from "@/lib/vehicleBounds";

/** Approximate anchors on three.js demo GLB (no lamp meshes) — scaled by measured fit radius. */
export function headlightAnchors(radius: number) {
  const r = radius;
  return {
    drlL: { x: r * 0.88, y: r * 0.19, z: r * 0.34 },
    drlR: { x: r * 0.88, y: r * 0.19, z: -r * 0.34 },
    beamL: { x: r * 0.92, y: r * 0.17, z: r * 0.27 },
    beamR: { x: r * 0.92, y: r * 0.17, z: -r * 0.27 },
    rearL: { x: -r * 0.86, y: r * 0.21, z: r * 0.32 },
    rearR: { x: -r * 0.86, y: r * 0.21, z: -r * 0.32 },
    centerY: (m: VehicleFitMetrics) => m.centerY,
  };
}