import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Component, Suspense, lazy, type ReactNode } from "react";
import { MOUSE } from "three";
import { VehicleFallback } from "@/components/scenes/VehicleFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupported } from "@/hooks/useWebGLSupported";

const VehicleSculpt = lazy(() =>
  import("@/components/scenes/VehicleSculpt").then((m) => ({ default: m.VehicleSculpt }))
);

type Props = { className?: string; dpr?: number };

class WebGLErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export function VehicleCanvas({ className, dpr = 1.5 }: Props) {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupported();

  if (!webgl) {
    return <VehicleFallback className={`relative overflow-hidden ${className ?? ""}`} />;
  }

  return (
    <div className={className} data-cursor="orbit" aria-label="Interactive AUREL Type-01 sculpture">
      <WebGLErrorBoundary fallback={<VehicleFallback className="relative h-full min-h-[280px] overflow-hidden" />}>
        <Canvas
          dpr={reduced ? 1 : dpr}
          camera={{ position: [3.2, 1.4, 4.2], fov: 42 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <VehicleSculpt />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={!reduced}
            minDistance={3.2}
            maxDistance={6}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 4}
            mouseButtons={{
              LEFT: MOUSE.ROTATE,
              MIDDLE: MOUSE.DOLLY,
              RIGHT: undefined,
            }}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}