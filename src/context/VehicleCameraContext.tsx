import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CameraPresetId } from "@/lib/cameraPresets";

type VehicleCameraContextValue = {
  preset: CameraPresetId | null;
  setPreset: (id: CameraPresetId | null) => void;
  userDriving: boolean;
  setUserDriving: (v: boolean) => void;
};

const VehicleCameraContext = createContext<VehicleCameraContextValue | null>(null);

export function VehicleCameraProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<CameraPresetId | null>(null);
  const [userDriving, setUserDriving] = useState(false);

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
    }),
    [preset, setPreset, userDriving]
  );

  return <VehicleCameraContext.Provider value={value}>{children}</VehicleCameraContext.Provider>;
}

export function useVehicleCamera() {
  const ctx = useContext(VehicleCameraContext);
  if (!ctx) throw new Error("useVehicleCamera must be used within VehicleCameraProvider");
  return ctx;
}