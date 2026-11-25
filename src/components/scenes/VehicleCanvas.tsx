import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Component, Suspense, lazy, useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { CinematicOrbitControls } from "@/components/scenes/CinematicOrbitControls";
import { dismissOrbitCoachmark, OrbitCoachmark } from "@/components/scenes/OrbitCoachmark";
import { VehicleFallback } from "@/components/scenes/VehicleFallback";
import { useCanvasInView } from "@/hooks/useCanvasInView";
import { useFinePointer } from "@/hooks/useFinePointer";
import { useNarrowViewport } from "@/hooks/useNarrowViewport";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupported } from "@/hooks/useWebGLSupported";

const VehicleModel = lazy(() =>
  import("@/components/scenes/VehicleModel").then((m) => ({ default: m.VehicleModel }))
);

type Props = { className?: string; dpr?: number };

function SceneLoader() {
  return (
    <Html center>
      <p className="text-mono border border-graphite bg-ink/90 px-4 py-2 text-silver">Loading Type-01…</p>
    </Html>
  );
}

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
  const fine = useFinePointer();
  const narrow = useNarrowViewport();
  const { ref: viewRef, inView } = useCanvasInView<HTMLDivElement>();
  const orbitActive = useRef(false);

  useEffect(() => {
    viewRef.current?.setAttribute("data-canvas-visible", inView ? "true" : "false");
  }, [inView, viewRef]);

  const onPointerDown = () => {
    if (!fine && !orbitActive.current) {
      orbitActive.current = true;
      dismissOrbitCoachmark();
    }
  };

  if (webgl === null) {
    return (
      <div
        className={`flex items-center justify-center border border-graphite bg-charcoal ${className ?? ""}`}
        aria-busy="true"
      >
        <p className="text-mono px-4 py-2 text-silver">Checking WebGL…</p>
      </div>
    );
  }

  if (!webgl) {
    return <VehicleFallback className={`relative overflow-hidden ${className ?? ""}`} reason="webgl" />;
  }

  const maxDpr = reduced ? 1 : narrow ? Math.min(dpr, 1.35) : dpr;
  const fov = narrow ? 39 : 35;

  return (
    <div
      ref={viewRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      data-cursor="orbit"
      data-canvas-visible={inView ? "true" : "false"}
      aria-label="Interactive AUREL Type-01"
      onPointerDown={onPointerDown}
    >
      <OrbitCoachmark />
      <WebGLErrorBoundary
        fallback={<VehicleFallback className="relative h-full min-h-[280px] overflow-hidden" reason="error" />}
      >
        <Canvas
          className="!h-full !w-full"
          dpr={[1, maxDpr]}
          frameloop={inView ? "always" : "demand"}
          camera={{ position: [2.8, 0.95, 3.6], fov }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.06,
          }}
        >
          <Suspense fallback={<SceneLoader />}>
            <VehicleModel />
          </Suspense>
          <CinematicOrbitControls enableZoom={!reduced} narrowViewport={narrow} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}