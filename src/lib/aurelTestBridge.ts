export type AurelTestSnapshot = {
  bodyHex: string;
  interiorHex: string;
  rimHex: string;
  rimRoughness: number;
  wheelScale: number;
  envPreset: string;
  meshCount: number;
  canvasCount: number;
  wheelHubs?: string[];
  lampMeshes?: (string | null)[];
};

declare global {
  interface Window {
    __AUREL_TEST__?: AurelTestSnapshot;
  }
}

export function publishAurelTest(snapshot: AurelTestSnapshot) {
  if (import.meta.env.PROD) return;
  window.__AUREL_TEST__ = { ...(window.__AUREL_TEST__ ?? {}), ...snapshot } as AurelTestSnapshot;
}

export function publishAurelTestPartial(partial: Partial<AurelTestSnapshot> & Record<string, unknown>) {
  if (import.meta.env.PROD) return;
  const prev = window.__AUREL_TEST__ ?? ({} as AurelTestSnapshot);
  window.__AUREL_TEST__ = { ...prev, ...partial };
}