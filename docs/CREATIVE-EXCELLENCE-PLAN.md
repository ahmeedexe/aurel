# AUREL — Creative Excellence Plan (Phase 1–2)

## Phase 1 — Audit summary

| Section | Strength | Opportunity |
|---------|----------|-------------|
| Preloader / Hero | GSAP iris, mask reveal, pin | Hero strong; configurator is climax not hero |
| Manifesto | Pinned typography scrub | — |
| Machine reel | Horizontal pin (md+) | 3D moved to single canvas (correct) |
| Design details | Horizontal gallery | Hover only on desktop |
| Engineering | Counter scrub | Static presentation |
| The Drive | Parallax still | — |
| Configurator | Working GLB + HDR | Default static camera; no scroll choreography |
| Private atelier | Editorial split | Weak **ending**; no cinematic coda |
| Global | Lenis + ST, grain, cursor | No ACES tone mapping; canvas runs off-screen |

## Phase 2 — Art direction (upgrade pass)

- **Light:** Studio key from `lightAccent`, cool fill, rim kicker; HDR local files.
- **Camera:** Slow scroll-scrub orbit until user drags (handoff to OrbitControls).
- **Materials:** Pearl sheen, tuned clearcoat; pooled materials unchanged.
- **Typography:** Finale display scale + mono system line.
- **Transitions:** Mask reveal into configurator (clip-path scrub), not decorative shaders.
- **Performance:** `frameloop` demand when canvas off-screen; ACES exposure lock.

## Phase 3–5 — Implementation priority

1. Cinematic scroll camera + tone mapping (`CinematicOrbitControls`, `VehicleCanvas`).
2. Material polish (`vehicleMaterials.ts`).
3. Configurator stage reveal + paint swatches.
4. Finale motion (`PrivateExperience`).
5. Visibility-based render loop.

## Phase 6 — Verification

`npx tsc`, `npm run build`, `npm run verify:3d`, `npm run test:smoke`, manual Chrome `#experience`.