import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { MOUSE } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useVehicleCamera } from "@/context/VehicleCameraContext";
import { CAMERA_PRESETS } from "@/lib/cameraPresets";
import { ensureGsapPlugins, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  enableZoom: boolean;
};

export function CinematicOrbitControls({ enableZoom }: Props) {
  const ref = useRef<OrbitControlsImpl>(null);
  const reduced = useReducedMotion();
  const { preset, userDriving, setUserDriving, setPreset } = useVehicleCamera();
  const scrollT = useRef(0.28);
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(0, 0.28, 0));

  useLayoutEffect(() => {
    if (reduced) return;
    ensureGsapPlugins();

    const st = ScrollTrigger.create({
      trigger: "#experience",
      start: "top 72%",
      end: "bottom 28%",
      scrub: 0.85,
      onUpdate: (self) => {
        scrollT.current = self.progress;
      },
    });

    return () => {
      st.kill();
    };
  }, [reduced]);

  useFrame((state) => {
    const controls = ref.current;
    if (!controls || reduced) return;

    const scrollActive = !userDriving && !preset;

    if (scrollActive) {
      const eased = 1 - Math.pow(1 - scrollT.current, 1.35);
      const azimuth = 0.42 + eased * Math.PI * 0.62;
      const polar = 1.12 + eased * 0.14;
      controls.setAzimuthalAngle(azimuth);
      controls.setPolarAngle(polar);
      targetVec.current.set(0, 0.28, 0);
      controls.target.lerp(targetVec.current, 0.12);
      controls.update();
      state.invalidate();
      return;
    }

    if (preset) {
      const spec = CAMERA_PRESETS[preset];
      const currentAz = controls.getAzimuthalAngle();
      const currentPo = controls.getPolarAngle();
      const nextAz = THREE.MathUtils.lerp(currentAz, spec.azimuth, 0.11);
      const nextPo = THREE.MathUtils.lerp(currentPo, spec.polar, 0.11);
      controls.setAzimuthalAngle(nextAz);
      controls.setPolarAngle(nextPo);
      targetVec.current.set(0, spec.targetY, 0);
      controls.target.lerp(targetVec.current, 0.14);

      const dist = camera.position.distanceTo(controls.target);
      const nextDist = THREE.MathUtils.lerp(dist, spec.distance, 0.1);
      const dir = camera.position.clone().sub(controls.target).normalize().multiplyScalar(nextDist);
      camera.position.copy(controls.target).add(dir);

      controls.update();
      state.invalidate();
    }
  });

  return (
    <OrbitControls
      ref={ref}
      enablePan={false}
      enableZoom={enableZoom}
      minDistance={2.4}
      maxDistance={5.5}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={Math.PI / 5}
      mouseButtons={{
        LEFT: MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: undefined,
      }}
      onStart={() => {
        setUserDriving(true);
        setPreset(null);
      }}
    />
  );
}