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

export function isTireMesh(name: string): boolean {
  return name.toLowerCase() === "tire";
}

export function isRimMesh(name: string): boolean {
  return RIM_PREFIX.test(name.toLowerCase());
}

export function isWheelScaleMesh(name: string): boolean {
  const n = name.toLowerCase();
  return WHEEL_MESHES.has(n) || isRimMesh(n) || n === "tire";
}

export function isInteriorMesh(name: string): boolean {
  const n = name.toLowerCase();
  if (INTERIOR_EXACT.has(n)) return true;
  if (n.includes("interior") && !n.includes("glass")) return true;
  if (n.includes("carpet") || n.startsWith("steering") || n.includes("seat") || n.includes("leather")) {
    return true;
  }
  return false;
}