import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CameraPresetId } from "@/lib/cameraPresets";
import type { VehicleFitMetrics } from "@/lib/vehicleBounds";

const DEFAULT_FIT: VehicleFitMetrics = { radius: 1.05, footY: -0.02, centerY: 0.26 };

type VehicleCameraContextValue = {
  preset: CameraPresetId | null;
  setPreset: (id: CameraPresetId | null) => void;
  userDriving: boolean;
  setUserDriving: (v: boolean) => void;
  fit: VehicleFitMetrics;
  setFit: (m: VehicleFitMetrics) => void;
};

const VehicleCameraContext = createContext<VehicleCameraContextValue | null>(null);

export function VehicleCameraProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<CameraPresetId | null>(null);
  const [userDriving, setUserDriving] = useState(false);
  const [fit, setFit] = useState<VehicleFitMetrics>(DEFAULT_FIT);

  const setPreset = useCallback((id: CameraPresetId | null) => {
    setPresetState(id);
    if (id) setUserDriving(false);
  }, []);

  const value = useMemo(
    () => ({
      preset,
      setPreset,
      userDriving,
      setUserDriving,
      fit,
      setFit,
    }),
    [fit, preset, setPreset, userDriving]
  );

  return <VehicleCameraContext.Provider value={value}>{children}</VehicleCameraContext.Provider>;
}

export function useVehicleCamera() {
  const ctx = useContext(VehicleCameraContext);
  if (!ctx) throw new Error("useVehicleCamera must be used within VehicleCameraProvider");
  return ctx;
}