import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_CONFIG,
  INTERIORS,
  LIGHTING,
  PAINTS,
  WHEELS,
  type InteriorId,
  type LightingId,
  type PaintId,
  type WheelId,
} from "@/data/config";

type ConfigState = typeof DEFAULT_CONFIG;

type ConfiguratorContextValue = ConfigState & {
  setPaint: (id: PaintId) => void;
  setWheels: (id: WheelId) => void;
  setInterior: (id: InteriorId) => void;
  setLighting: (id: LightingId) => void;
  reset: () => void;
  paintHex: string;
  interiorHex: string;
  wheelScale: number;
  rimHex: string;
  rimRoughness: number;
  envPreset: "studio" | "sunset" | "night";
  lightAccent: string;
};

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfigState>(DEFAULT_CONFIG);

  const setPaint = useCallback((id: PaintId) => setState((s) => ({ ...s, paint: id })), []);
  const setWheels = useCallback((id: WheelId) => setState((s) => ({ ...s, wheels: id })), []);
  const setInterior = useCallback((id: InteriorId) => setState((s) => ({ ...s, interior: id })), []);
  const setLighting = useCallback((id: LightingId) => setState((s) => ({ ...s, lighting: id })), []);
  const reset = useCallback(() => setState(DEFAULT_CONFIG), []);

  const value = useMemo(() => {
    const paintHex = PAINTS.find((p) => p.id === state.paint)!.hex;
    const interiorHex = INTERIORS.find((p) => p.id === state.interior)!.hex;
    const wheelOpt = WHEELS.find((p) => p.id === state.wheels)!;
    const light = LIGHTING.find((p) => p.id === state.lighting)!;
    return {
      ...state,
      setPaint,
      setWheels,
      setInterior,
      setLighting,
      reset,
      paintHex,
      interiorHex,
      wheelScale: wheelOpt.scale,
      rimHex: wheelOpt.rimHex,
      rimRoughness: wheelOpt.roughness,
      envPreset: light.preset,
      lightAccent: light.accent,
    };
  }, [reset, setInterior, setLighting, setPaint, setWheels, state]);

  return <ConfiguratorContext.Provider value={value}>{children}</ConfiguratorContext.Provider>;
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) throw new Error("useConfigurator must be used within ConfiguratorProvider");
  return ctx;
}