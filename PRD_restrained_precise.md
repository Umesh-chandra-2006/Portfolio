# PRD: Portfolio Site — "Restrained Precision" Track
**Codename:** Singularity
**Owner:** Umesh
**Version:** 1.0

## 1. Concept
One cosmic visual system, parametrized per section. Content readability and load performance are non-negotiable constraints; the space theme is expressed through motion and color, not density of assets.

## 2. Goals
- First-visit load under 2s on mid-range mobile (Moto G-class, 4G).
- Every section legible without a user needing to squint or wait for animation to settle.
- Single canvas/WebGL context reused across the whole page (no per-section engine swaps).
- Design reads as "engineered," reinforcing the AI Engineer / systems-thinker positioning on the resume.

## 3. Core Architecture
- **Rendering:** One `<canvas>` with a lightweight WebGL particle system (or React Three Fiber if already in stack). No per-section separate canvases.
- **Parametrization model:** A single `SceneConfig` object per section controls:
  - `particleDensity` (0–1)
  - `colorPalette` (2–3 colors max)
  - `motionProfile` (drift / orbit / burst / static)
  - `focalBody` (none / blackhole / nebula-glow / pulsar-ping)
- **Scroll driver:** GSAP ScrollTrigger maps scroll progress → `SceneConfig` interpolation (lerp between adjacent section configs, not hard cuts).
- **Content layer:** All text/cards sit on a `bg-slate-950/70 backdrop-blur` panel — content is never directly on raw canvas.

## 4. Section-by-Section Spec

| Section | Body | Visual Treatment | Notes |
|---|---|---|---|
| Hero | Black hole | Accretion-disk glow (radial gradient + subtle rotation), faked lensing via CSS `backdrop-filter` warp on nearby elements only — no true ray-marched lensing | Cheapest visual that reads as "black hole" |
| Internships | Orbiting bodies | 2–3 small orbiting dots around a central star, one orbit per internship | Orbit = structure/institution |
| Projects | Nebula | Soft particle cloud, low density, color-shifted per project tag | Birthplace metaphor |
| Skills | Quasar | Thin bright beam + particle burst on hover per skill tag | Restrained: beam is CSS gradient, not shader |
| Certifications | Pulsar | Slow opacity pulse behind cert cards, fixed interval | Signals "verified/regular" |
| Contact/Footer | Full starfield | Density maxes out, static (no more scroll-driven changes) | Zoomed-out "full map" close |

## 5. Non-Functional Requirements
- Lighthouse performance score ≥ 90 on mobile.
- Respect `prefers-reduced-motion`: fall back to static starfield, no particle animation.
- Total JS for visual system ≤ 150KB gzipped.
- No layout shift from canvas resizing (fixed aspect containers).
- Works without WebGL (canvas 2D fallback with fewer particles) for older devices.

## 6. Explicit Non-Goals
- No true gravitational lensing shader.
- No per-section bespoke shader files — one system, config-driven.
- No sound design.
- No cursor-following complex physics simulations.

## 7. Success Metrics
- Time-to-interactive < 2.5s (4G, mid-tier device).
- Bounce rate on hero section (if analytics added) comparable to or better than static-background baseline.
- Zero reported readability complaints during peer/recruiter review pass.

## 8. Risks
- Under-delivering on "wow factor" relative to maximalist competitors' portfolios.
- Mitigation: motion + scroll-linked transitions carry most of the visual interest, not asset complexity.
