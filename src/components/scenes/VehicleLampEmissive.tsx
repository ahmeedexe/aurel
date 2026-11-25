import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVehicleCamera } from "@/context/VehicleCameraContext";
import { useVehicleExperience } from "@/context/VehicleExperienceContext";
import { vehicleSceneRefs } from "@/lib/vehicleSceneRefs";

const DRL = 0xe8f2ff;
const HEAD = 0xfff4e8;
const REAR = 0xff3344;

export function VehicleLampEmissive() {
  const { lightsOn, lightPhase } = useVehicleExperience();
  const { fit } = useVehicleCamera();
  const { camera } = useThree();
  const touched = useRef(new Set<THREE.Mesh>());

  useEffect(() => {
    return () => {
      for (const mesh of touched.current) {
        const base = mesh.userData.__lampBase as { emissive: THREE.Color; intensity: number } | undefined;
        const mat = mesh.material;
        if (base && mat instanceof THREE.MeshStandardMaterial) {
          mat.emissive.copy(base.emissive);
          mat.emissiveIntensity = base.intensity;
        }
      }
      touched.current.clear();
    };
  }, []);

  useFrame(() => {
    const probe = vehicleSceneRefs.probe;
    if (!probe) return;

    const apply = (mesh: THREE.Mesh | null, color: number, intensity: number) => {
      if (!mesh) return;
      const mat = mesh.material;
      if (!(mat instanceof THREE.MeshStandardMaterial) && !(mat instanceof THREE.MeshPhysicalMaterial)) return;
      if (!mesh.userData.__lampBase) {
        mesh.userData.__lampBase = {
          emissive: mat.emissive.clone(),
          intensity: mat.emissiveIntensity,
        };
        touched.current.add(mesh);
      }
      if (!lightsOn || intensity <= 0) {
        const base = mesh.userData.__lampBase as { emissive: THREE.Color; intensity: number };
        mat.emissive.copy(base.emissive);
        mat.emissiveIntensity = base.intensity;
        return;
      }
      mat.emissive.setHex(color);
      mat.emissiveIntensity = intensity;
    };

    let drlK =
      lightPhase === "drl" || lightPhase === "headlamp" || lightPhase === "full" ? (lightPhase === "drl" ? 0.85 : 0.45) : 0;
    let headK = lightPhase === "headlamp" || lightPhase === "full" ? 1.05 : 0;
    const fwd = probe.lamps.forward;
    const toCam = camera.position.clone().sub(new THREE.Vector3(0, fit.centerY, 0));
    toCam.y *= 0.65;
    toCam.normalize();
    const rearFacing = toCam.dot(fwd) < -0.2;
    const frontFacing = toCam.dot(fwd) > 0.2;
    const rearK = rearFacing && lightPhase === "full" ? 0.52 : 0;
    if (!frontFacing) {
      drlK *= 0.3;
      headK = 0;
    }

    apply(probe.lamps.drlMesh, DRL, drlK);
    apply(probe.lamps.headMesh, HEAD, headK);
    apply(probe.lamps.rearMesh, REAR, rearK);
  });

  return null;
}