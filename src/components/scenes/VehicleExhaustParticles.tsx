import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useVehicleExperience } from "@/context/VehicleExperienceContext";
import { vehicleSceneRefs } from "@/lib/vehicleSceneRefs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const COUNT = 56;
const SPAWN = 18;

type Particle = {
  life: number;
  maxLife: number;
  velocity: THREE.Vector3;
};

export function VehicleExhaustParticles() {
  const reduced = useReducedMotion();
  const { drivePhase, experienceRunning, wheelRpmRef } = useVehicleExperience();
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>(Array.from({ length: COUNT }, () => makeParticle(0)));
  const cursor = useRef(0);

  const texture = useMemo(() => {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(210,210,215,0.55)");
    g.addColorStop(0.45, "rgba(160,165,172,0.25)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((state, delta) => {
    const probe = vehicleSceneRefs.probe;
    const pts = pointsRef.current;
    if (!probe || !pts || reduced) return;

    const engineActive =
      drivePhase === "startup" || drivePhase === "rolling" || (drivePhase === "stopping" && wheelRpmRef.current > 0.35);
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const alpha = pts.geometry.getAttribute("a") as THREE.BufferAttribute;

    if (!engineActive) {
      for (let i = 0; i < COUNT; i++) {
        particles.current[i].life = 0;
        alpha.setX(i, 0);
      }
      alpha.needsUpdate = true;
      return;
    }

    const rpmFactor = THREE.MathUtils.clamp(wheelRpmRef.current / 14, 0.15, 1.2);
    const spawnRate = (experienceRunning ? 26 : 16) * rpmFactor;
    const toSpawn = Math.floor(spawnRate * delta * SPAWN);

    const localF = probe.lamps.local.forward.clone().normalize();
    const back = localF.clone().multiplyScalar(-1);

    for (let s = 0; s < toSpawn; s++) {
      const side = cursor.current % 2 === 0 ? probe.exhaust.localLeft : probe.exhaust.localRight;
      cursor.current += 1;
      const p = particles.current[cursor.current % COUNT];
      p.life = p.maxLife;
      p.velocity
        .set((Math.random() - 0.5) * 0.05, 0.08 + Math.random() * 0.08, (Math.random() - 0.5) * 0.05)
        .add(back.clone().multiplyScalar(0.14 + Math.random() * 0.08));
      attr.setXYZ(cursor.current % COUNT, side.x, side.y, side.z);
    }
    for (let i = 0; i < COUNT; i++) {
      const p = particles.current[i];
      if (p.life <= 0) {
        alpha.setX(i, 0);
        continue;
      }
      p.life -= delta;
      const x = attr.getX(i) + p.velocity.x * delta;
      const y = attr.getY(i) + p.velocity.y * delta;
      const z = attr.getZ(i) + p.velocity.z * delta;
      attr.setXYZ(i, x, y, z);
      alpha.setX(i, THREE.MathUtils.clamp(p.life / p.maxLife, 0, 1) * 0.58);
    }
    attr.needsUpdate = true;
    alpha.needsUpdate = true;
    state.invalidate();
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const alphas = new Float32Array(COUNT);
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("a", new THREE.BufferAttribute(alphas, 1));
    return g;
  }, []);

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        map={texture}
        size={fitSize()}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0.65}
        color="#c5c9d0"
        blending={THREE.NormalBlending}
        onBeforeCompile={(shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            "void main() {",
            `attribute float a;\nvarying float vA;\nvoid main() {`
          );
          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            "#include <begin_vertex>\nvA = a;"
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            "varying float vA;\nvoid main() {"
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 diffuseColor = vec4( diffuse, opacity );",
            "vec4 diffuseColor = vec4( diffuse, opacity * vA );"
          );
        }}
      />
    </points>
  );
}

function fitSize() {
  const r = vehicleSceneRefs.probe?.wheels[0]?.hub.length() ?? 1;
  return THREE.MathUtils.clamp(0.06 + r * 0.002, 0.055, 0.095);
}

function makeParticle(_seed: number): Particle {
  return {
    life: 0,
    maxLife: 0.9 + Math.random() * 0.7,
    velocity: new THREE.Vector3(),
  };
}