import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useVehicleCamera } from "@/context/VehicleCameraContext";
import { useVehicleExperience, type LightPhase } from "@/context/VehicleExperienceContext";
import { headlightAnchors } from "@/lib/vehicleLightAnchors";
import { vehicleSceneRefs } from "@/lib/vehicleSceneRefs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HEAD_WHITE = "#fff7ef";
const DRL_WHITE = "#f3f6ff";
const BRAKE = "#ff3b3b";
type LocalLamp = {
  drlL: THREE.Vector3;
  drlR: THREE.Vector3;
  headL: THREE.Vector3;
  headR: THREE.Vector3;
  rear: THREE.Vector3;
  forward: THREE.Vector3;
  groundL: THREE.Vector3;
  groundR: THREE.Vector3;
};

export function VehicleLightRig() {
  const reduced = useReducedMotion();
  const { fit } = useVehicleCamera();
  const { lightsOn, lightPhase, setLightPhase, experienceRunning, drivePhase } = useVehicleExperience();

  const fallback = useMemo(() => {
    const a = headlightAnchors(fit.radius);
    const y = fit.centerY;
    return {
      drlL: new THREE.Vector3(a.drlL.x, a.drlL.y + y, a.drlL.z),
      drlR: new THREE.Vector3(a.drlR.x, a.drlR.y + y, a.drlR.z),
      headL: new THREE.Vector3(a.beamL.x, a.beamL.y + y, a.beamL.z),
      headR: new THREE.Vector3(a.beamR.x, a.beamR.y + y, a.beamR.z),
      rear: new THREE.Vector3(a.rearL.x, a.rearL.y + y, a.rearL.z),
      forward: new THREE.Vector3(1, 0, 0),
      groundL: new THREE.Vector3(a.beamL.x + 1.8, -0.02, a.beamL.z),
      groundR: new THREE.Vector3(a.beamR.x + 1.8, -0.02, a.beamR.z),
    } satisfies LocalLamp;
  }, [fit.centerY, fit.radius]);

  const drlL = useRef<THREE.SpotLight>(null);
  const drlR = useRef<THREE.SpotLight>(null);
  const beamL = useRef<THREE.SpotLight>(null);
  const beamR = useRef<THREE.SpotLight>(null);
  const groundL = useRef<THREE.SpotLight>(null);
  const groundR = useRef<THREE.SpotLight>(null);
  const rearL = useRef<THREE.SpotLight>(null);
  const rearR = useRef<THREE.SpotLight>(null);

  const phaseT = useRef(0);
  const startup = useRef(false);
  const phaseRef = useRef<LightPhase>("off");
  const dlFade = useRef(0);
  const drFade = useRef(0);

  const publishPhase = (p: LightPhase) => {
    if (phaseRef.current === p) return;
    phaseRef.current = p;
    setLightPhase(p);
  };

  useEffect(() => {
    if (!lightsOn) {
      publishPhase("off");
      phaseT.current = 0;
      startup.current = false;
      dlFade.current = 0;
      drFade.current = 0;
      return;
    }
    if (reduced) {
      publishPhase("full");
      dlFade.current = 1;
      drFade.current = 1;
      return;
    }
    startup.current = true;
    phaseT.current = 0;
    dlFade.current = 0;
    drFade.current = 0;
    publishPhase("drl");
  }, [lightsOn, reduced]);

  const resolveLocal = (): LocalLamp => {
    const probe = vehicleSceneRefs.probe?.lamps.local;
    if (probe) return probe;
    return fallback;
  };

  useFrame((state, delta) => {
    const L = resolveLocal();
    const beamDist = fit.radius * 9;

    const setPos = (light: THREE.SpotLight | null, pos: THREE.Vector3) => {
      if (!light) return;
      light.position.copy(pos);
    };

    setPos(drlL.current, L.drlL);
    setPos(drlR.current, L.drlR);
    setPos(beamL.current, L.headL);
    setPos(beamR.current, L.headR);
    setPos(groundL.current, L.headL);
    setPos(groundR.current, L.headR);
    setPos(rearL.current, L.rear);
    setPos(rearR.current, L.rear.clone().add(new THREE.Vector3(0, 0, 0.12)));

    const targetBeamL = L.headL.clone().add(L.forward.clone().multiplyScalar(beamDist));
    const targetBeamR = L.headR.clone().add(L.forward.clone().multiplyScalar(beamDist));
    beamL.current?.target.position.copy(targetBeamL);
    beamR.current?.target.position.copy(targetBeamR);
    groundL.current?.target.position.copy(L.groundL);
    groundR.current?.target.position.copy(L.groundR);

    const fwdWorld = vehicleSceneRefs.probe?.lamps.forward ?? new THREE.Vector3(1, 0, 0);
    const vehCenter = new THREE.Vector3(0, fit.centerY, 0);
    const toCam = state.camera.position.clone().sub(vehCenter);
    toCam.y *= 0.65;
    toCam.normalize();
    const frontFacing = toCam.dot(fwdWorld) > 0.22;
    const frontBeamScale = frontFacing ? 1 : 0.06;
    const rearAim = L.rear.clone().add(L.forward.clone().multiplyScalar(-2.4));
    rearL.current?.target.position.copy(rearAim);
    rearR.current?.target.position.copy(rearAim);

    if (!lightsOn) {
      apply(0, 0, 0, 0, 0, 0);
      setRear(0);
      return;
    }

    if (reduced) {
      apply(1, 1, 1 * frontBeamScale, 1 * frontBeamScale, 0.85 * frontBeamScale, 0.85 * frontBeamScale);
      return;
    }

    if (startup.current) {
      phaseT.current += delta;
      if (phaseT.current < 0.35) {
        publishPhase("drl");
        dlFade.current = THREE.MathUtils.smoothstep(phaseT.current, 0, 0.35);
        drFade.current = THREE.MathUtils.smoothstep(phaseT.current, 0.12, 0.35);
        apply(dlFade.current * 0.72, drFade.current * 0.72, 0, 0, 0, 0);
      } else if (phaseT.current < 1.05) {
        publishPhase("headlamp");
        const k = THREE.MathUtils.smoothstep(phaseT.current, 0.35, 1.05);
        apply(0.62, 0.62, k * frontBeamScale, k * frontBeamScale, (0.15 + k * 1.15) * frontBeamScale, (0.15 + k * 1.15) * frontBeamScale);
      } else {
        publishPhase("full");
        startup.current = false;
        apply(0.55, 0.55, frontBeamScale, frontBeamScale, 1.05 * frontBeamScale, 1.05 * frontBeamScale);
      }
    } else {
      apply(0.55, 0.55, frontBeamScale, frontBeamScale, 1.05 * frontBeamScale, 1.05 * frontBeamScale);
    }

    const rearFacing = state.camera.position.x < -fit.radius * 0.22;
    const rearGain =
      rearFacing && lightPhase !== "off" && lightPhase !== "drl"
        ? 0.45 + (experienceRunning || drivePhase === "rolling" ? 0.2 : 0)
        : 0;
    setRear(rearGain);

    state.invalidate();

    function apply(dl: number, dr: number, bl: number, br: number, floL: number, floR: number) {
      if (drlL.current) drlL.current.intensity = dl * 28;
      if (drlR.current) drlR.current.intensity = dr * 28;
      if (beamL.current) beamL.current.intensity = bl * 68;
      if (beamR.current) beamR.current.intensity = br * 68;
      if (groundL.current) groundL.current.intensity = floL * 52;
      if (groundR.current) groundR.current.intensity = floR * 52;
    }

    function setRear(k: number) {
      if (rearL.current) rearL.current.intensity = k * 18;
      if (rearR.current) rearR.current.intensity = k * 18;
    }
  });

  const L0 = resolveLocal();

  return (
    <group>
      <spotLight
        ref={drlL}
        angle={0.42}
        penumbra={0.92}
        intensity={0}
        color={DRL_WHITE}
        distance={fit.radius * 3.5}
        decay={2}
      />
      <spotLight
        ref={drlR}
        angle={0.42}
        penumbra={0.92}
        intensity={0}
        color={DRL_WHITE}
        distance={fit.radius * 3.5}
        decay={2}
      />
      <spotLight ref={beamL} angle={0.34} penumbra={0.58} intensity={0} color={HEAD_WHITE} distance={fit.radius * 10} decay={2}>
        <object3D attach="target" />
      </spotLight>
      <spotLight ref={beamR} angle={0.34} penumbra={0.58} intensity={0} color={HEAD_WHITE} distance={fit.radius * 10} decay={2}>
        <object3D attach="target" />
      </spotLight>
      <spotLight
        ref={groundL}
        angle={0.55}
        penumbra={0.72}
        intensity={0}
        color={HEAD_WHITE}
        distance={fit.radius * 6}
        decay={2}
      >
        <object3D attach="target" position={L0.groundL} />
      </spotLight>
      <spotLight
        ref={groundR}
        angle={0.55}
        penumbra={0.72}
        intensity={0}
        color={HEAD_WHITE}
        distance={fit.radius * 6}
        decay={2}
      >
        <object3D attach="target" position={L0.groundR} />
      </spotLight>
      <spotLight ref={rearL} angle={0.48} penumbra={0.88} intensity={0} color={BRAKE} distance={fit.radius * 2.8} decay={2}>
        <object3D attach="target" position={L0.rear.clone().add(L0.forward.clone().multiplyScalar(-2.4))} />
      </spotLight>
      <spotLight ref={rearR} angle={0.48} penumbra={0.88} intensity={0} color={BRAKE} distance={fit.radius * 2.8} decay={2}>
        <object3D attach="target" position={L0.rear.clone().add(L0.forward.clone().multiplyScalar(-2.4))} />
      </spotLight>
    </group>
  );
}