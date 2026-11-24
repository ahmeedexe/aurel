export type CameraPresetId = "front" | "profile" | "cabin";

/** Spherical orbit targets — cabin is an elevated exterior windshield view, not interior geometry. */
export const CAMERA_PRESETS: Record<
  CameraPresetId,
  { azimuth: number; polar: number; distance: number; targetY: number; label: string; hint: string }
> = {
  front: {
    azimuth: 0.05,
    polar: 1.38,
    distance: 3.15,
    targetY: 0.28,
    label: "Front",
    hint: "Head-on studio",
  },
  profile: {
    azimuth: Math.PI * 0.48,
    polar: 1.32,
    distance: 3.45,
    targetY: 0.26,
    label: "Profile",
    hint: "Side graphic",
  },
  cabin: {
    azimuth: 0.22,
    polar: 1.02,
    distance: 2.72,
    targetY: 0.42,
    label: "Cabin",
    hint: "Exterior windshield view",
  },
};