# AUREL — Phase 0: Reference analysis & implementation strategy

## 1. Reference analysis (actually inspected)

### Studio Mærtens (live, Nov 2026)
- **Observed:** Full black field; navigation as sparse text links (Work / About); brand mark as registered wordmark.
- **Typography:** Oversized muted serif glyph used as environmental layer; circular “technical label” copy (DESIGNED BY STUDIO MÆRTENS…) as a compositional element, not body copy.
- **Motion (inferred from structure):** Load state likely drives reveal; scroll may be section-based rather than dense content.
- **Principles for AUREL:** Treat type as architecture; reduce chrome; let one dominant visual (vehicle or 3D sculpture) hold the frame; use mono labels for engineering credibility; high contrast dark UI with rare accent (signal red).

### Behance gallery (not fully automated — principles from brief + Mærtens site)
- Industrial-design studio positioning; project-as-artifact presentation; bold negative space.

### Awwwards pattern language (synthesis, not copied)
- Pinned scroll chapters, mask-based reveals, split headlines, honest performance fallbacks on mobile.

## 2. Proposed art direction — AUREL

| Axis | Direction |
|------|-----------|
| **Mood** | Black-box studio, single light source, metal and shadow |
| **Type** | Display: **Bebas Neue** (condensed automotive); editorial: **Instrument Serif**; body: **DM Sans**; labels: **IBM Plex Mono** |
| **Composition** | Asymmetric grids, 120–140vh scenes, headlines cropped by viewport edges |
| **Accent** | Signal red `#D62828` only on CTAs, active config, key stats |
| **Vehicle** | Fictional grand tourer “AUREL Type-01” — no real marque cues |

**Originality guardrails:** No dealership grids, no spec tables in cards, no generic glass nav. Navigation = overlay + section hash chapters.

## 3. Motion direction

| Layer | Tool | Use |
|-------|------|-----|
| Intro preloader + hero choreography | GSAP timeline | Staggered mask, wordmark, headline lines |
| Scroll story (6 sections) | GSAP ScrollTrigger | Pin, scrub, typographic reveals |
| UI (nav, menu, config panel) | Motion (`motion/react`) | Spring overlays, layout |
| 3D centerpiece | R3F + drei | Stylized **procedural sculpture** (licensed-free geometry); material/lighting swaps |
| Scroll smoothing | Lenis | Synced with ScrollTrigger; disabled when `prefers-reduced-motion` |

Easing: `power3.out` for entrances, `power2.inOut` for scrubbed scroll. No spin loops.

## 4. Technical architecture

```
aurel/
  docs/                    # Creative + QA notes
  public/images/           # Generated stills + ATTRIBUTION
  src/
    components/
      navigation/          # Header, MenuOverlay
      hero/                # Preloader, Hero
      scenes/              # VehicleSculpt (R3F, lazy)
      sections/            # Manifesto … PrivateExperience
      configurator/        # ConfiguratorPanel
      interactions/        # MagneticButton, CustomCursor (desktop)
      ui/
    context/               # ConfiguratorProvider, SoundProvider
    hooks/                 # useLenis, useReducedMotion, useGsapContext
    lib/                   # gsap, colors, constants
    data/                  # specs, config options
    styles/                # tokens in index.css
```

- **3D honesty:** No unlicensed GLB. Abstract lathe/extruded “Type-01” mesh with `MeshPhysicalMaterial`; configurator changes body color, wheel scale, env preset.
- **Image layer:** AI-generated hero + detail stills for scroll sections; config uses 3D material + optional still crossfade on low perf.
- **Mobile:** Simpler 3D (lower DPR, no custom cursor); pinned sections shortened.

## 5. Visual asset plan

| Asset | Source | Usage |
|-------|--------|--------|
| `hero-vehicle.jpg` | AI generate | Hero mask reveal, fallback |
| `drive-cinematic.jpg` | AI | Section 05 |
| `detail-headlight.jpg`, `detail-wheel.jpg`, `detail-carbon.jpg`, `detail-interior.jpg` | AI | Section 03 gallery |
| `machine-profile.jpg` | AI | Section 02 |
| `favicon.svg` | Vector | Tab icon |
| 3D sculpture | Code (R3F) | Machine + configurator |

All assets self-owned; ATTRIBUTION.md in `public/images/`.

## 6. QA checklist (Phase 14)
- `tsc` + `vite build`
- Breakpoints: 1440, 1280, 1024, 768, 390, 360
- Configurator color/wheel/interior/lighting visible
- `prefers-reduced-motion` bypasses Lenis + heavy scrub
- Keyboard: menu, skip link, focus rings