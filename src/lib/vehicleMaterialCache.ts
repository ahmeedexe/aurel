import * as THREE from "three";
import {
  createBodyPaint,
  createInterior,
  createRimMaterial,
  createTireMaterial,
} from "@/lib/vehicleMaterials";

const pool = new Map<string, THREE.Material>();

function fromPool(key: string, factory: () => THREE.Material): THREE.Material {
  let material = pool.get(key);
  if (!material) {
    material = factory();
    pool.set(key, material);
  }
  return material;
}

function isPooled(m: THREE.Material) {
  return [...pool.values()].includes(m);
}

function disposeIfOrphan(material: THREE.Material | THREE.Material[]) {
  const list = Array.isArray(material) ? material : [material];
  for (const m of list) {
    if (!isPooled(m)) m.dispose();
  }
}

export function assignMeshMaterial(mesh: THREE.Mesh, next: THREE.Material) {
  const prev = mesh.material;
  if (prev === next) return;
  if (mesh.userData.aurelManagedMaterial && prev) {
    disposeIfOrphan(prev);
  }
  mesh.material = next;
  mesh.userData.aurelManagedMaterial = true;
}

export function bodyPaintMaterial(hex: string) {
  return fromPool(`body:${hex}`, () => createBodyPaint(hex));
}

export function interiorMaterial(hex: string) {
  return fromPool(`interior:${hex}`, () => createInterior(hex));
}

export function rimMaterial(hex: string, roughness: number) {
  return fromPool(`rim:${hex}:${roughness}`, () => createRimMaterial(hex, roughness));
}

export function tireMaterial() {
  return fromPool("tire", () => createTireMaterial());
}

export function clearVehicleMaterialPool() {
  pool.forEach((m) => m.dispose());
  pool.clear();
}