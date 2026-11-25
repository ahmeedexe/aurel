import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useVehicleCamera } from "@/context/VehicleCameraContext";
import { useVehicleExperience } from "@/context/VehicleExperienceContext";
import { vehicleSceneRefs } from "@/lib/vehicleSceneRefs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  rigRef: React.RefObject<THREE.Group | null>;
};

const WHEEL_RADIUS = 0.34;
const MAX_RPM = 14;
const ROLL_DURATION = 3.2;

export function VehicleExperienceMotion({ rigRef }: Props) {
  const reduced = useReducedMotion();
  const { fit, setPreset, setUserDriving } = useVehicleCamera();
  const {
    experienceRunning,
    setRollProgress,
    endExperience,
    experienceToken,
    setLightsOn,
    drivePhase,
    setDrivePhase,
    wheelRpmRef,
    startEngine,
  } = useVehicleExperience();

  const elapsed = useRef(0);
  const basePos = useRef<THREE.Vector3 | null>(null);
  const forward = useRef(new THREE.Vector3());
  const phaseElapsed = useRef(0);

  useEffect(() => {
    if (!experienceRunning) return;
    elapsed.current = 0;
    phaseElapsed.current = 0;
    setPreset("front");
    setUserDriving(false);
    setLightsOn(true);
    startEngine();
    const rig = rigRef.current;
    if (rig) basePos.current = rig.position.clone();
  }, [experienceRunning, experienceToken, rigRef, setLightsOn, setPreset, setUserDriving, startEngine]);

  useEffect(() => {
    if (drivePhase === "startup") phaseElapsed.current = 0;
  }, [drivePhase]);

  useFrame((state, delta) => {
    const rig = rigRef.current;
    const probe = vehicleSceneRefs.probe;
    const wheels = probe?.wheels ?? [];

    if (!experienceRunning && drivePhase === "startup") {
      phaseElapsed.current += delta;
      if (phaseElapsed.current > 1.15) setDrivePhase("rolling");
    }

    if (probe?.lamps.forward && rig) {
      forward.current.copy(probe.lamps.local.forward).normalize();
    } else {
      forward.current.set(1, 0, 0);
    }

    const targetRpm = (() => {
      if (reduced) return drivePhase === "rolling" || experienceRunning ? MAX_RPM * 0.4 : 0;
      switch (drivePhase) {
        case "startup":
          return MAX_RPM * 0.2;
        case "rolling":
          return MAX_RPM;
        case "stopping":
          return 0;
        default:
          return experienceRunning ? MAX_RPM * 0.65 : 0;
      }
    })();

    const rpmLerp = drivePhase === "stopping" ? 2.8 : 3.4;
    wheelRpmRef.current = THREE.MathUtils.lerp(wheelRpmRef.current, targetRpm, 1 - Math.exp(-rpmLerp * delta));

    if (drivePhase === "stopping" && wheelRpmRef.current < 0.12 && !experienceRunning) {
      wheelRpmRef.current = 0;
      setDrivePhase("idle");
    }

    const omega = (wheelRpmRef.current / 60) * Math.PI * 2;

    for (const w of wheels) {
      if (Math.abs(omega) > 1e-4) {
        for (const part of w.spinParts) {
          part.mesh.rotateOnAxis(w.axleLocal, -omega * delta);
        }
      } else {
        for (const part of w.spinParts) {
          part.mesh.rotation.copy(part.baseRotation);
        }
      }
    }

    if (rig) {
      if (!experienceRunning && drivePhase === "idle" && wheelRpmRef.current < 0.01) {
        if (basePos.current) rig.position.lerp(basePos.current, 0.12);
        setRollProgress(0);
      } else if (experienceRunning && !reduced) {
        elapsed.current += delta;
        phaseElapsed.current += delta;
        const t = Math.min(elapsed.current / ROLL_DURATION, 1);
        const roll = THREE.MathUtils.smoothstep(t, 0.35, 1);

        if (phaseElapsed.current > 1.05 && drivePhase === "startup") {
          setDrivePhase("rolling");
        }

        if (!basePos.current) basePos.current = rig.position.clone();
        const travel = roll * fit.radius * 0.09;
        const deltaMove = forward.current.clone().multiplyScalar(travel);
        rig.position.copy(basePos.current).add(deltaMove);
        setRollProgress(roll);

        const linear = (wheelRpmRef.current / 60) * Math.PI * 2 * WHEEL_RADIUS;
        if (linear > 0.01 && roll > 0.25) {
          const sync = linear * delta * 0.85;
          rig.position.add(forward.current.clone().multiplyScalar(sync * 0.35));
        }

        if (t >= 1) {
          rig.position.copy(basePos.current);
          endExperience();
        }
      }
    }

    state.invalidate();
  });

  return null;
}