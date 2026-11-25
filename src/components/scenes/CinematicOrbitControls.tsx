import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { MOUSE } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useVehicleCamera } from "@/context/VehicleCameraContext";
import { useVehicleExperience } from "@/context/VehicleExperienceContext";
import { CAMERA_PRESETS, SCROLL_CAMERA } from "@/lib/cameraPresets";
import { ensureGsapPlugins, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  enableZoom: boolean;
  narrowViewport: boolean;
};

function distanceFor(fitRadius: number, mult: number, narrow: boolean) {
  return fitRadius * mult * (narrow ? 1.14 : 1);
}

export function CinematicOrbitControls({ enableZoom, narrowViewport }: Props) {
  const ref = useRef<OrbitControlsImpl>(null);
  const reduced = useReducedMotion();
  const { preset, userDriving, setUserDriving, setPreset, fit } = useVehicleCamera();
  const { experienceRunning, rollProgressRef } = useVehicleExperience();
  const scrollT = useRef(0.28);
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(0, fit.centerY, 0));

  const minDist = fit.radius * 1.42;
  const maxDist = fit.radius * 3.65;

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

    const scrollActive = !userDriving && !preset && !experienceRunning;
    const baseTargetY = fit.centerY;

    if (scrollActive) {
      const eased = 1 - Math.pow(1 - scrollT.current, 1.35);
      const azimuth = SCROLL_CAMERA.azimuthStart + eased * SCROLL_CAMERA.azimuthSpan;
      const polar = SCROLL_CAMERA.polarStart + eased * SCROLL_CAMERA.polarSpan;
      controls.setAzimuthalAngle(azimuth);
      controls.setPolarAngle(polar);
      targetVec.current.set(0, baseTargetY, 0);
      controls.target.lerp(targetVec.current, 0.12);

      const wantDist = distanceFor(fit.radius, SCROLL_CAMERA.distanceMult, narrowViewport);
      const dist = camera.position.distanceTo(controls.target);
      const nextDist = THREE.MathUtils.lerp(dist, wantDist, 0.08);
      const dir = camera.position.clone().sub(controls.target).normalize().multiplyScalar(nextDist);
      camera.position.copy(controls.target).add(dir);

      controls.update();
      state.invalidate();
      return;
    }

    if (preset) {
      const spec = CAMERA_PRESETS[preset];
      const currentAz = controls.getAzimuthalAngle();
      const currentPo = controls.getPolarAngle();
      const nextAz = THREE.MathUtils.lerp(currentAz, spec.azimuth, 0.12);
      const nextPo = THREE.MathUtils.lerp(currentPo, spec.polar, 0.12);
      controls.setAzimuthalAngle(nextAz);
      controls.setPolarAngle(nextPo);
      targetVec.current.set(0, baseTargetY + fit.radius * spec.targetYOff, 0);
      controls.target.lerp(targetVec.current, 0.14);

      const wantDist = distanceFor(fit.radius, spec.distanceMult, narrowViewport);
      const dist = camera.position.distanceTo(controls.target);
      const nextDist = THREE.MathUtils.lerp(dist, wantDist, 0.11);
      const dir = camera.position.clone().sub(controls.target).normalize().multiplyScalar(nextDist);
      camera.position.copy(controls.target).add(dir);

      controls.update();
      state.invalidate();
    }

    if (experienceRunning && !userDriving) {
      const dolly = rollProgressRef.current * fit.radius * 0.06;
      const mult = preset ? CAMERA_PRESETS[preset].distanceMult : SCROLL_CAMERA.distanceMult;
      const wantDist = distanceFor(fit.radius, mult, narrowViewport) - dolly;
      const dist = camera.position.distanceTo(controls.target);
      const nextDist = THREE.MathUtils.lerp(dist, wantDist, 0.08);
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
      minDistance={minDist}
      maxDistance={maxDist}
      maxPolarAngle={Math.PI / 2.08}
      minPolarAngle={Math.PI / 5.5}
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