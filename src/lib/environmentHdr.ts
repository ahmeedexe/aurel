import type { LightingId } from "@/data/config";

/** Self-hosted HDRIs (avoids drei CDN CORS failures in dev/preview). */
export const VEHICLE_HDRI: Record<"studio" | "sunset" | "night", string> = {
  studio: "/hdri/studio_small_03_1k.hdr",
  sunset: "/hdri/venice_sunset_1k.hdr",
  night: "/hdri/dikhololo_night_1k.hdr",
};

export type EnvPreset = keyof typeof VEHICLE_HDRI;

export function envPresetFromLighting(id: LightingId): EnvPreset {
  const map: Record<LightingId, EnvPreset> = {
    studio: "studio",
    sunset: "sunset",
    night: "night",
  };
  return map[id];
}