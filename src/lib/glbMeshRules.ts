const INTERIOR_EXACT = new Set([
  "interior_dark",
  "carpet",
  "steering_carbon",
  "steering_trim",
  "interior",
  "seat",
  "leather",
]);

const HIDDEN_MESHES = new Set(["yellow_trim", "blue"]);

const RIM_PREFIX = /^rim_/;
const WHEEL_MESHES = new Set(["wheel"]);

export function shouldHideMesh(name: string): boolean {
  return HIDDEN_MESHES.has(name.toLowerCase());
}

export function isBodyMesh(name: string): boolean {
  return name.toLowerCase() === "body";
}

export function isGlassMesh(name: string): boolean {
  const n = name.toLowerCase();
  return n === "glass" || n.includes("glass");
}

export function isTireMesh(name: string): boolean {
  return name.toLowerCase() === "tire";
}

export function isRimMesh(name: string): boolean {
  const n = name.toLowerCase();
  return RIM_PREFIX.test(n) || /^rim_(fl|fr|rl|rr)$/.test(n);
}

export function isLampMesh(name: string): boolean {
  const n = name.toLowerCase();
  return n === "lights" || n === "leds" || n === "lights_red";
}

/** Disc / hardware inside each `wheel_*` hub (not the hub group name). */
export function isWheelHardwareMesh(name: string): boolean {
  const n = name.toLowerCase();
  return n === "wheel" || n === "brake" || n === "centre" || n === "nuts";
}

export function isWheelScaleMesh(name: string): boolean {
  const n = name.toLowerCase();
  return WHEEL_MESHES.has(n) || isRimMesh(n) || n === "tire";
}

export function isInteriorMesh(name: string): boolean {
  const n = name.toLowerCase();
  if (isGlassMesh(name)) return false;
  if (INTERIOR_EXACT.has(n)) return true;
  if (n.includes("interior")) return true;
  if (n.includes("carpet") || n.startsWith("steering") || n.includes("seat") || n.includes("leather")) {
    return true;
  }
  return false;
}