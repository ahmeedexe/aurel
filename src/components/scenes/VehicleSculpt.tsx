import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useConfigurator } from "@/context/ConfiguratorContext";

function CameraRig() {
  const { camera, pointer } = useThree();
  const look = useRef(new THREE.Vector3(0, 0.42, 0));

  useFrame(() => {
    const targetX = 3.1 + pointer.x * 0.65;
    const targetY = 1.35 + pointer.y * 0.22;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
    camera.lookAt(look.current);
  });

  return null;
}

function Wheel({ x, z, scale, width }: { x: number; z: number; scale: number; width: number }) {
  return (
    <group position={[x, 0.26 * scale, z]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36 * scale, 0.36 * scale, width, 36]} />
        <meshPhysicalMaterial color="#101215" metalness={0.9} roughness={0.32} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.23 * scale, 0.23 * scale, width + 0.025, 28]} />
        <meshStandardMaterial color="#8a8f96" metalness={1} roughness={0.18} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <torusGeometry args={[0.27 * scale, 0.012, 8, 48]} />
        <meshStandardMaterial color="#c5c8cc" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function AurelBody({
  paintHex,
  interiorHex,
  accent,
}: {
  paintHex: string;
  interiorHex: string;
  accent: string;
}) {
  return (
    <group position={[0, -0.05, 0]}>
      <RoundedBox args={[1.72, 0.28, 3.95]} radius={0.06} smoothness={8} position={[0, 0.36, 0.05]}>
        <meshPhysicalMaterial color={paintHex} metalness={0.94} roughness={0.1} clearcoat={1} clearcoatRoughness={0.06} />
      </RoundedBox>
      <RoundedBox args={[1.12, 0.2, 1.55]} radius={0.05} smoothness={6} position={[0.06, 0.52, -0.35]}>
        <meshPhysicalMaterial color={paintHex} metalness={0.92} roughness={0.12} clearcoat={1} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.14, 1.25]} radius={0.04} smoothness={4} position={[0, 0.48, 1.15]} rotation={[0.08, 0, 0]}>
        <meshPhysicalMaterial color={paintHex} metalness={0.9} roughness={0.14} clearcoat={1} />
      </RoundedBox>
      <RoundedBox args={[1.02, 0.08, 1.05]} radius={0.03} smoothness={4} position={[0, 0.5, 0.62]}>
        <meshPhysicalMaterial color="#0c0d10" transmission={0.62} thickness={0.45} roughness={0} />
      </RoundedBox>
      <mesh position={[0, 0.44, -0.05]}>
        <boxGeometry args={[0.76, 0.05, 0.95]} />
        <meshStandardMaterial color={interiorHex} roughness={0.88} />
      </mesh>
      <mesh position={[0.92, 0.4, 1.42]}>
        <boxGeometry args={[0.05, 0.08, 0.42]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.4} />
      </mesh>
      <mesh position={[-0.92, 0.4, 1.42]}>
        <boxGeometry args={[0.05, 0.08, 0.42]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.4} />
      </mesh>
      <mesh position={[0, 0.34, -1.75]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[1.1, 0.04, 0.35]} />
        <meshStandardMaterial color="#15171a" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function VehicleSculpt() {
  const { paintHex, interiorHex, wheelScale, wheelWidth, envPreset, lightAccent } = useConfigurator();

  const positions = useMemo(
    () => [
      [-0.82, 1.25],
      [0.82, 1.25],
      [-0.82, -1.15],
      [0.82, -1.15],
    ],
    []
  );

  return (
    <>
      <color attach="background" args={["#08090b"]} />
      <CameraRig />
      <ambientLight intensity={0.28} />
      <spotLight position={[5, 7, 3]} angle={0.32} penumbra={0.9} intensity={55} color={lightAccent} />
      <spotLight position={[-6, 3, -4]} angle={0.48} intensity={14} color="#dfe1e4" />
      <pointLight position={[0, 1.2, 2.2]} intensity={6} color={lightAccent} />
      <AurelBody paintHex={paintHex} interiorHex={interiorHex} accent={lightAccent} />
      {positions.map(([x, z]) => (
        <Wheel key={`${x}-${z}`} x={x} z={z} scale={wheelScale} width={wheelWidth} />
      ))}
      <ContactShadows position={[0, 0, 0]} opacity={0.5} blur={2.8} scale={9} far={4} />
      <Environment preset={envPreset} />
    </>
  );
}