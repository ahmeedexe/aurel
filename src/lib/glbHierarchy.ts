/** Names from aurel-type-01.glb (FBX2glTF Ferrari demo). */
export const WHEEL_HUB_NAMES = ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"] as const;
export type WheelHubId = (typeof WHEEL_HUB_NAMES)[number];

export const LAMP_MESH_NAMES = {
  drl: "leds",
  headlamp: "lights",
  rear: "lights_red",
} as const;

export const WHEEL_CHILD_MESH = new Set(["tire", "wheel", "rim_fl", "rim_fr", "rim_rl", "rim_rr", "centre", "nuts", "brake"]);