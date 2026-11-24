import { Center, ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { publishAurelTest } from "@/lib/aurelTestBridge";
import { VEHICLE_HDRI } from "@/lib/environmentHdr";
import {
  isBodyMesh,
  isInteriorMesh,
  isRimMesh,
  isTireMesh,
  isWheelScaleMesh,
  shouldHideMesh,
} from "@/lib/glbMeshRules";
import {
  assignMeshMaterial,
  bodyPaintMaterial,
  interiorMaterial,
  rimMaterial,
  tireMaterial,
} from "@/lib/vehicleMaterialCache";

export const VEHICLE_GLB = "/models/aurel-type-01.glb";

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

    if (isBodyMesh(name)) {
      assignMeshMaterial(obj, bodyPaintMaterial(opts.paintHex));
      return;
    }

    if (isInteriorMesh(name)) {
      assignMeshMaterial(obj, interiorMaterial(opts.interiorHex));
      return;
    }

    if (isTireMesh(name)) {
      assignMeshMaterial(obj, tireMaterial());
    }

    if (isRimMesh(name)) {
      assignMeshMaterial(obj, rimMaterial(opts.rimHex, opts.rimRoughness));
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

export function VehicleModel() {
  const { scene } = useGLTF(VEHICLE_GLB);
  const model = useMemo(() => scene.clone(true), [scene]);
  const { paintHex, interiorHex, rimHex, rimRoughness, wheelScale, envPreset, lightAccent } =
    useConfigurator();

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

  return (
    <>
      <color attach="background" args={["#08090b"]} />
      <ambientLight intensity={0.26} />
      <spotLight position={[6, 9, 4]} angle={0.38} penumbra={0.85} intensity={62} color={lightAccent} castShadow={false} />
      <spotLight position={[-5.5, 3.5, -2]} angle={0.52} penumbra={0.9} intensity={22} color="#c8cbd0" />
      <spotLight position={[-7, 2.5, 5]} angle={0.45} intensity={28} color={lightAccent} />
      <Center>
        <group rotation={[0, Math.PI / 2, 0]}>
          <primitive object={model} />
        </group>
      </Center>
      <ContactShadows position={[0, -0.02, 0]} opacity={0.62} blur={2.8} scale={12} far={5} />
      <Environment files={VEHICLE_HDRI[envPreset]} environmentIntensity={envPreset === "night" ? 0.85 : 1.05} />
    </>
  );
}

useGLTF.preload(VEHICLE_GLB);