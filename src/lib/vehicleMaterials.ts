import * as THREE from "three";

const PAINT_PROFILE: Record<string, Partial<THREE.MeshPhysicalMaterialParameters>> = {
  "#e6e4df": {
    metalness: 0.28,
    roughness: 0.18,
    clearcoatRoughness: 0.1,
    sheen: 0.42,
    sheenRoughness: 0.35,
    envMapIntensity: 1.45,
  },
  "#8f1f24": {
    metalness: 0.72,
    roughness: 0.16,
    envMapIntensity: 1.15,
  },
  "#8b9098": {
    metalness: 0.94,
    roughness: 0.1,
    envMapIntensity: 1.28,
  },
};

export function createBodyPaint(hex: string) {
  const tone = PAINT_PROFILE[hex.toLowerCase()] ?? {};
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(hex),
    metalness: tone.metalness ?? 0.88,
    roughness: tone.roughness ?? 0.14,
    clearcoat: 1,
    clearcoatRoughness: tone.clearcoatRoughness ?? 0.06,
    sheen: tone.sheen ?? 0,
    sheenRoughness: tone.sheenRoughness ?? 1,
    envMapIntensity: tone.envMapIntensity ?? 1.22,
  });
}

export function createInterior(hex: string) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    metalness: 0.15,
    roughness: 0.82,
    envMapIntensity: 0.7,
  });
}

export function createRimMaterial(hex: string, roughness: number) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    metalness: 0.98,
    roughness,
    envMapIntensity: 1.38,
  });
}

export function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#15171a",
    metalness: 0.05,
    roughness: 0.06,
    transmission: 0.88,
    thickness: 0.35,
    transparent: true,
    opacity: 1,
    envMapIntensity: 0.35,
    ior: 1.45,
  });
}

export function createTireMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#0c0d10",
    metalness: 0.05,
    roughness: 0.92,
  });
}

export function createBrakeDiscMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#232428",
    metalness: 0.78,
    roughness: 0.42,
    envMapIntensity: 0.55,
  });
}

export function createWheelCapMaterial(hex: string) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    metalness: 0.92,
    roughness: 0.22,
    envMapIntensity: 1.05,
  });
}

export function createLampDrlMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#2a3540",
    emissive: "#000000",
    emissiveIntensity: 0,
    metalness: 0.1,
    roughness: 0.35,
    transparent: true,
    opacity: 0.92,
  });
}

export function createLampHeadMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#1b1e24",
    emissive: "#000000",
    emissiveIntensity: 0,
    metalness: 0,
    roughness: 0.12,
    transmission: 0.55,
    thickness: 0.15,
    transparent: true,
    opacity: 1,
    ior: 1.48,
  });
}

export function createLampRearMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#3a1010",
    emissive: "#000000",
    emissiveIntensity: 0,
    metalness: 0.05,
    roughness: 0.2,
    transparent: true,
    opacity: 0.88,
  });
}