export type PaintId = "obsidian" | "titanium" | "racing" | "pearl";
export type WheelId = "aero" | "performance" | "signature";
export type InteriorId = "graphite" | "sand" | "crimson";
export type LightingId = "studio" | "sunset" | "night";

export const PAINTS: { id: PaintId; label: string; hex: string }[] = [
  { id: "obsidian", label: "Obsidian Black", hex: "#0a0b0d" },
  { id: "titanium", label: "Titanium Silver", hex: "#8b9098" },
  { id: "racing", label: "Racing Red", hex: "#8f1f24" },
  { id: "pearl", label: "Pearl White", hex: "#e6e4df" },
];

export const WHEELS: { id: WheelId; label: string; scale: number; rimHex: string; roughness: number }[] = [
  { id: "aero", label: "Aero", scale: 0.93, rimHex: "#6a6e75", roughness: 0.28 },
  { id: "performance", label: "Performance", scale: 1, rimHex: "#9aa0a8", roughness: 0.22 },
  { id: "signature", label: "Signature", scale: 1.05, rimHex: "#d4d8de", roughness: 0.14 },
];

export const INTERIORS: { id: InteriorId; label: string; hex: string }[] = [
  { id: "graphite", label: "Graphite", hex: "#2a2c30" },
  { id: "sand", label: "Sand", hex: "#b8a992" },
  { id: "crimson", label: "Crimson", hex: "#6b1e22" },
];

export const LIGHTING: { id: LightingId; label: string; preset: "studio" | "sunset" | "night"; accent: string }[] = [
  { id: "studio", label: "Studio", preset: "studio", accent: "#ffffff" },
  { id: "sunset", label: "Sunset", preset: "sunset", accent: "#ff9f6b" },
  { id: "night", label: "Night", preset: "night", accent: "#3d5afe" },
];

export const DEFAULT_CONFIG = {
  paint: "obsidian" as PaintId,
  wheels: "performance" as WheelId,
  interior: "graphite" as InteriorId,
  lighting: "studio" as LightingId,
};