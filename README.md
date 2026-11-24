# AUREL — Beyond the Drive

Experimental luxury automotive digital experience. React · Vite · Tailwind v4 · GSAP · R3F · Motion · Lenis.

```bash
npm install
npm run dev          # http://127.0.0.1:5175
npm run build
npm run verify:3d    # Playwright Chrome — GLB, canvas, materials (dev server must be up)
npm run test:smoke   # Playwright smoke tests (set AUREL_BASE_URL if not 5176)
```

- **3D:** Licensed demo GLB (`public/models/aurel-type-01.glb`) with real material configurator — single `VehicleCanvas` in `#experience`. HDRIs self-hosted in `public/hdri/` (fixes drei CDN CORS). See `public/models/MODEL_ATTRIBUTION.md`.
- **Imagery:** Self-hosted AI-generated stills (`public/images/ATTRIBUTION.md`).
- **Sound:** Off by default; optional UI ticks when enabled.

Creative brief: `docs/PHASE-0-REFERENCE-AND-STRATEGY.md`.