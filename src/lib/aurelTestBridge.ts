export type AurelTestSnapshot = {
  bodyHex: string;
  interiorHex: string;
  rimHex: string;
  rimRoughness: number;
  wheelScale: number;
  envPreset: string;
  meshCount: number;
  canvasCount: number;
};

declare global {
  interface Window {
    __AUREL_TEST__?: AurelTestSnapshot;
  }
}

export function publishAurelTest(snapshot: AurelTestSnapshot) {
  if (import.meta.env.PROD) return;
  window.__AUREL_TEST__ = snapshot;
}