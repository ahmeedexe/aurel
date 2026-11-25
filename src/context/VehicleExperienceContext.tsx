import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";

export type LightPhase = "off" | "drl" | "headlamp" | "full";
export type DrivePhase = "idle" | "startup" | "rolling" | "stopping";

type VehicleExperienceContextValue = {
  lightsOn: boolean;
  setLightsOn: (v: boolean) => void;
  lightPhase: LightPhase;
  setLightPhase: (p: LightPhase) => void;
  experienceRunning: boolean;
  rollProgressRef: MutableRefObject<number>;
  setRollProgress: (t: number) => void;
  startExperience: () => void;
  endExperience: () => void;
  experienceToken: number;
  bumpExperienceToken: () => void;
  drivePhase: DrivePhase;
  wheelRpmRef: MutableRefObject<number>;
  startEngine: () => void;
  stopEngine: () => void;
  setDrivePhase: (p: DrivePhase) => void;
  resetDrive: () => void;
};

const VehicleExperienceContext = createContext<VehicleExperienceContextValue | null>(null);

export function VehicleExperienceProvider({ children }: { children: ReactNode }) {
  const [lightsOn, setLightsOnState] = useState(false);
  const [lightPhase, setLightPhase] = useState<LightPhase>("off");
  const [experienceRunning, setExperienceRunning] = useState(false);
  const rollProgressRef = useRef(0);
  const setRollProgress = useCallback((t: number) => {
    rollProgressRef.current = t;
  }, []);
  const [experienceToken, setExperienceToken] = useState(0);
  const [drivePhase, setDrivePhase] = useState<DrivePhase>("idle");
  const wheelRpmRef = useRef(0);
  const runningRef = useRef(false);

  const setLightsOn = useCallback((v: boolean) => {
    setLightsOnState(v);
    if (!v) setLightPhase("off");
  }, []);

  const bumpExperienceToken = useCallback(() => {
    setExperienceToken((n) => n + 1);
  }, []);

  const startEngine = useCallback(() => {
    wheelRpmRef.current = 0;
    setDrivePhase("startup");
    setLightsOnState(true);
  }, []);

  const stopEngine = useCallback(() => {
    if (drivePhase === "idle" && wheelRpmRef.current === 0) {
      setLightsOnState(false);
      setLightPhase("off");
      return;
    }
    setDrivePhase("stopping");
  }, [drivePhase]);

  const resetDrive = useCallback(() => {
    runningRef.current = false;
    setExperienceRunning(false);
    wheelRpmRef.current = 0;
    rollProgressRef.current = 0;
    setDrivePhase("idle");
  }, []);

  const startExperience = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    setExperienceRunning(true);
    rollProgressRef.current = 0;
    wheelRpmRef.current = 0;
    setDrivePhase("startup");
    bumpExperienceToken();
  }, [bumpExperienceToken]);

  const endExperience = useCallback(() => {
    runningRef.current = false;
    setExperienceRunning(false);
    rollProgressRef.current = 0;
    setDrivePhase("stopping");
  }, []);

  const value = useMemo(
    () => ({
      lightsOn,
      setLightsOn,
      lightPhase,
      setLightPhase,
      experienceRunning,
      rollProgressRef,
      setRollProgress,
      startExperience,
      endExperience,
      experienceToken,
      bumpExperienceToken,
      drivePhase,
      wheelRpmRef,
      startEngine,
      stopEngine,
      setDrivePhase,
      resetDrive,
    }),
    [
      bumpExperienceToken,
      drivePhase,
      endExperience,
      experienceRunning,
      experienceToken,
      lightPhase,
      lightsOn,
      rollProgressRef,
      setLightsOn,
      startEngine,
      startExperience,
      stopEngine,
      resetDrive,
    ]
  );

  return <VehicleExperienceContext.Provider value={value}>{children}</VehicleExperienceContext.Provider>;
}

export function useVehicleExperience() {
  const ctx = useContext(VehicleExperienceContext);
  if (!ctx) throw new Error("useVehicleExperience must be used within VehicleExperienceProvider");
  return ctx;
}