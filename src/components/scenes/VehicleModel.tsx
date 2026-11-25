import { Center, ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { VehicleExhaustParticles } from "@/components/scenes/VehicleExhaustParticles";
import { VehicleExperienceMotion } from "@/components/scenes/VehicleExperienceMotion";
import { VehicleLampEmissive } from "@/components/scenes/VehicleLampEmissive";
import { VehicleLightRig } from "@/components/scenes/VehicleLightRig";
import { VehicleSceneProbe } from "@/components/scenes/VehicleSceneProbe";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { useVehicleCamera } from "@/context/VehicleCameraContext";
import { useVehicleExperience } from "@/context/VehicleExperienceContext";
import { publishAurelTest } from "@/lib/aurelTestBridge";
import { VEHICLE_HDRI } from "@/lib/environmentHdr";
import {
  isBodyMesh,
  isGlassMesh,
  isInteriorMesh,
  isLampMesh,
  isRimMesh,
  isTireMesh,
  isWheelHardwareMesh,
  isWheelScaleMesh,
  shouldHideMesh,
} from "@/lib/glbMeshRules";
import { measureVehicleBounds, type VehicleFitMetrics } from "@/lib/vehicleBounds";
import {
  assignMeshMaterial,
  bodyPaintMaterial,
  brakeDiscMaterial,
  glassMaterial,
  interiorMaterial,
  lampDrlMaterial,
  lampHeadMaterial,
  lampRearMaterial,
  rimMaterial,
  tireMaterial,
  wheelCapMaterial,
} from "@/lib/vehicleMaterialCache";

export const VEHICLE_GLB = "/models/aurel-type-01.glb";

const STAGE_FLOOR_Y = -0.004;

function applyVehicleConfig(
  root: THREE.Object3D,
  opts: {
    paintHex: string;
    interiorHex: string;
    rimHex: string;
    rimRoughness: number;
    wheelScale: number;
    envPreset: keyof typeof VEHICLE_HDRI;
  }
) {
  let meshCount = 0;

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    meshCount += 1;
    const name = obj.name;

    if (shouldHideMesh(name)) {
      obj.visible = false;
      return;
    }

    if (isGlassMesh(name)) {
      assignMeshMaterial(obj, glassMaterial());
      return;
    }

    if (isBodyMesh(name)) {
      const mat = bodyPaintMaterial(opts.paintHex);
      if (mat instanceof THREE.MeshPhysicalMaterial) {
        mat.envMapIntensity = opts.envPreset === "night" ? 1.05 : (mat.envMapIntensity ?? 1.15);
      }
      assignMeshMaterial(obj, mat);
      return;
    }

    if (isInteriorMesh(name)) {
      assignMeshMaterial(obj, interiorMaterial(opts.interiorHex));
      return;
    }

    if (isLampMesh(name)) {
      const n = name.toLowerCase();
      if (n === "leds") assignMeshMaterial(obj, lampDrlMaterial());
      else if (n === "lights") assignMeshMaterial(obj, lampHeadMaterial());
      else assignMeshMaterial(obj, lampRearMaterial());
      return;
    }

    if (isTireMesh(name)) {
      assignMeshMaterial(obj, tireMaterial());
      return;
    }

    if (isRimMesh(name)) {
      assignMeshMaterial(obj, rimMaterial(opts.rimHex, opts.rimRoughness));
      return;
    }

    if (isWheelHardwareMesh(name)) {
      const n = name.toLowerCase();
      if (n === "brake" || n === "wheel") assignMeshMaterial(obj, brakeDiscMaterial());
      else assignMeshMaterial(obj, wheelCapMaterial(opts.rimHex));
      return;
    }

    if (isWheelScaleMesh(name)) {
      const base = (obj.userData.baseScale as THREE.Vector3 | undefined) ?? obj.scale.clone();
      if (!obj.userData.baseScale) obj.userData.baseScale = base;
      obj.scale.set(base.x * opts.wheelScale, base.y * opts.wheelScale, base.z * opts.wheelScale);
    }
  });

  publishAurelTest({
    bodyHex: opts.paintHex,
    interiorHex: opts.interiorHex,
    rimHex: opts.rimHex,
    rimRoughness: opts.rimRoughness,
    wheelScale: opts.wheelScale,
    envPreset: opts.envPreset,
    meshCount,
    canvasCount: typeof document !== "undefined" ? document.querySelectorAll("canvas").length : 0,
  });
}

function snapVehicleToFloor(rig: THREE.Object3D): VehicleFitMetrics {
  const box = new THREE.Box3().setFromObject(rig);
  rig.position.y -= box.min.y;
  const grounded = new THREE.Box3().setFromObject(rig);
  return {
    ...measureVehicleBounds(rig),
    footY: grounded.min.y,
    centerY: (grounded.min.y + grounded.max.y) * 0.5,
  };
}

type GroundedVehicleProps = {
  model: THREE.Object3D;
  onFit: (m: VehicleFitMetrics) => void;
  configKey: string;
};

function GroundedVehicle({ model, onFit, configKey }: GroundedVehicleProps) {
  const rigRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!rigRef.current) return;
    rigRef.current.position.set(0, 0, 0);
    onFit(snapVehicleToFloor(rigRef.current));
  }, [model, configKey, onFit]);

  return (
    <group ref={rigRef} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={model} />
      <VehicleSceneProbe rigRef={rigRef} model={model} configKey={configKey} />
      <VehicleLightRig />
      <VehicleLampEmissive />
      <VehicleExperienceMotion rigRef={rigRef} />
      <VehicleExhaustParticles />
    </group>
  );
}

export function VehicleModel() {
  const { scene } = useGLTF(VEHICLE_GLB);
  const model = useMemo(() => scene.clone(true), [scene]);
  const { paintHex, interiorHex, rimHex, rimRoughness, wheelScale, envPreset, lightAccent } =
    useConfigurator();
  const { lightsOn, experienceRunning, drivePhase } = useVehicleExperience();
  const { setFit } = useVehicleCamera();

  const onFit = useCallback(
    (m: VehicleFitMetrics) => {
      setFit(m);
    },
    [setFit]
  );

  useLayoutEffect(() => {
    applyVehicleConfig(model, {
      paintHex,
      interiorHex,
      rimHex,
      rimRoughness,
      wheelScale,
      envPreset,
    });
  }, [model, paintHex, interiorHex, rimHex, rimRoughness, wheelScale, envPreset]);

  const configKey = `${paintHex}-${interiorHex}-${rimHex}-${wheelScale}`;
  const envIntensity = envPreset === "night" ? 0.92 : envPreset === "sunset" ? 1.08 : 1.12;
  const keyColor = lightsOn ? "#e4e8ee" : lightAccent;
  const rimColor = lightsOn ? "#c8ccd4" : lightAccent;
  const studioKey = lightsOn ? 42 : 58;
  const studioRim = lightsOn ? 14 : 22;
  const cinematicDim =
    experienceRunning && (drivePhase === "startup" || drivePhase === "idle") ? 0.72 : 1;

  return (
    <>
      <color attach="background" args={["#08090b"]} />
      <ambientLight intensity={(lightsOn ? 0.16 : 0.24) * cinematicDim} />
      <spotLight position={[6, 9, 4]} angle={0.38} penumbra={0.85} intensity={studioKey} color={keyColor} />
      <spotLight position={[-5.5, 3.5, -2]} angle={0.52} penumbra={0.9} intensity={24} color="#c8cbd0" />
      <spotLight position={[-6.5, 2.2, 5.5]} angle={0.48} intensity={studioRim} color={rimColor} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, STAGE_FLOOR_Y, 0]} receiveShadow>
        <circleGeometry args={[7.5, 72]} />
        <meshStandardMaterial color="#0b0c0e" metalness={0.35} roughness={0.88} envMapIntensity={0.35} />
      </mesh>
      <Center>
        <GroundedVehicle model={model} onFit={onFit} configKey={configKey} />
      </Center>
      <ContactShadows
        position={[0, STAGE_FLOOR_Y + 0.006, 0]}
        opacity={0.68}
        blur={2.6}
        scale={16}
        far={7}
        color="#000000"
      />
      <Environment files={VEHICLE_HDRI[envPreset]} environmentIntensity={envIntensity} />
    </>
  );
}

useGLTF.preload(VEHICLE_GLB);