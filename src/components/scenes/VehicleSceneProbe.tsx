import { useLayoutEffect, type RefObject } from "react";
import type * as THREE from "three";
import { probeVehicleScene } from "@/lib/probeVehicleScene";
import { vehicleSceneRefs } from "@/lib/vehicleSceneRefs";
import { publishAurelTestPartial } from "@/lib/aurelTestBridge";

type Props = {
  rigRef: RefObject<THREE.Group | null>;
  model: THREE.Object3D;
  configKey: string;
};

export function VehicleSceneProbe({ rigRef, model, configKey }: Props) {
  useLayoutEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    const probe = probeVehicleScene(rig, model);
    vehicleSceneRefs.probe = probe;
    vehicleSceneRefs.probeVersion += 1;

    if (probe) {
      for (const w of probe.wheels) {
        for (const part of w.spinParts) {
          part.mesh.rotation.copy(part.baseRotation);
        }
      }
      publishAurelTestPartial({
        wheelHubs: probe.wheels.map((w) => w.id),
        lampMeshes: [
          probe.lamps.drlMesh?.name ?? null,
          probe.lamps.headMesh?.name ?? null,
          probe.lamps.rearMesh?.name ?? null,
        ],
      });
    }
  }, [rigRef, model, configKey]);

  return null;
}