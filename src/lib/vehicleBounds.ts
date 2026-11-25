import * as THREE from "three";

export type VehicleFitMetrics = {
  radius: number;
  footY: number;
  centerY: number;
};

export function measureVehicleBounds(root: THREE.Object3D): VehicleFitMetrics {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) * 0.52;
  return {
    radius: Math.max(radius, 0.65),
    footY: box.min.y,
    centerY: (box.min.y + box.max.y) * 0.5,
  };
}