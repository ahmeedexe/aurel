import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  playTick: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

function unlockContext(ctx: AudioContext) {
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const humNodesRef = useRef<OscillatorNode[]>([]);
  const humGainRef = useRef<GainNode | null>(null);

  const ensureEngine = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    const ctx = ctxRef.current;
    unlockContext(ctx);
    return { ctx, master: masterRef.current! };
  }, []);

  const playUiTick = useCallback((ctx: AudioContext, master: GainNode) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.05);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.045, t + 0.012);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.09);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.1);
  }, []);

  const stopAmbient = useCallback(() => {
    const ctx = ctxRef.current;
    const gain = humGainRef.current;
    if (!ctx || !gain) return;

    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.35);

    for (const osc of humNodesRef.current) {
      try {
        osc.stop(t + 0.4);
      } catch {
        /* already stopped */
      }
    }
    humNodesRef.current = [];
    humGainRef.current = null;
  }, []);

  const startAmbient = useCallback((ctx: AudioContext, master: GainNode) => {
    if (humGainRef.current) return;

    const bus = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    filter.Q.value = 0.6;

    bus.gain.value = 0;
    bus.connect(filter);
    filter.connect(master);

    const oscA = ctx.createOscillator();
    oscA.type = "sine";
    oscA.frequency.value = 54;

    const oscB = ctx.createOscillator();
    oscB.type = "sine";
    oscB.frequency.value = 108;

    oscA.connect(bus);
    oscB.connect(bus);
    oscA.start();
    oscB.start();

    const t = ctx.currentTime;
    bus.gain.linearRampToValueAtTime(0.06, t + 0.7);

    humNodesRef.current = [oscA, oscB];
    humGainRef.current = bus;
  }, []);

  const toggle = useCallback(() => {
    if (enabledRef.current) {
      stopAmbient();
      enabledRef.current = false;
      setEnabled(false);
      return;
    }

    const { ctx, master } = ensureEngine();
    unlockContext(ctx);

    startAmbient(ctx, master);
    playUiTick(ctx, master);

    enabledRef.current = true;
    setEnabled(true);
  }, [ensureEngine, playUiTick, startAmbient, stopAmbient]);

  const playTick = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    unlockContext(ctx);
    playUiTick(ctx, master);
  }, [playUiTick]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    return () => {
      stopAmbient();
      void ctxRef.current?.close();
      ctxRef.current = null;
      masterRef.current = null;
    };
  }, [stopAmbient]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, playTick }}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}