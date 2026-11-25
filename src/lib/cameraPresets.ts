export type CameraPresetId = "front" | "profile" | "cabin" | "rear";

/**
 * Angles tuned for the demo GLB after Y=π/2 placement (three.js sample mesh — not a bespoke AUREL model).
 * `distanceMult` is multiplied by measured `fitRadius` at runtime.
 */
export const CAMERA_PRESETS: Record<
  CameraPresetId,
  {
    azimuth: number;
    polar: number;
    distanceMult: number;
    targetYOff: number;
    label: string;
    hint: string;
  }
> = {
  front: {
    azimuth: Math.PI * 0.52,
    polar: 1.44,
    distanceMult: 2.15,
    targetYOff: 0.02,
    label: "Front",
    hint: "Head-on studio",
  },
  profile: {
    azimuth: Math.PI * 0.02,
    polar: 1.34,
    distanceMult: 2.38,
    targetYOff: 0,
    label: "Profile",
    hint: "Side graphic",
  },
  cabin: {
    azimuth: Math.PI * 0.48,
    polar: 1.12,
    distanceMult: 1.88,
    targetYOff: 0.08,
    label: "Cabin",
    hint: "Exterior windshield view",
  },
  rear: {
    azimuth: Math.PI * 1.02,
    polar: 1.36,
    distanceMult: 2.22,
    targetYOff: 0.03,
    label: "Rear",
    hint: "Tail lamps · demo anchors",
  },
};

export const SCROLL_CAMERA = {
  azimuthStart: 0.48,
  azimuthSpan: Math.PI * 0.54,
  polarStart: 1.18,
  polarSpan: 0.1,
  distanceMult: 2.05,
};