---
name: web-prototype
description: |
  Build or modify MIN public-facing pages and components. This skill governs
  the workflow for Hero, section layouts, navigation, footer, and any new
  public page. Always read the design system first. Never write CSS from scratch —
  extend globals.css tokens or use Tailwind utilities.
triggers:
  - "build a page"
  - "new section"
  - "hero redesign"
  - "landing page"
  - "public page"
  - "component"
od:
  mode: prototype
  platform: desktop
  scenario: design
  design_system:
    requires: true
    sections: [color, typography, layout, components]
  inputs:
    - name: page_name
      type: string
      required: true
    - name: sections
      type: string
      required: true
      description: Comma-separated list of sections needed
  outputs:
    primary: components/public/{PageName}.jsx
    secondary:
      - app/(public)/page.js
      - styles/globals.css
---

# MIN Web Prototype Skill

## Pre-flight Reads (mandatory, in order)

1. `design-systems/min/DESIGN.md` — active design system
2. `styles/globals.css` — existing tokens and utilities
3. `AGENTS.md` — workspace conventions and safety rules
4. The target page/component file if it exists

## Hard Rules

- **Single accent**: Nepal crimson (#C41E3A) only. Use ≤2× per screen.
- **No rounded corners**: 0 radius everywhere. Sharp edges are intentional.
- **No shadows**: Elevation through spacing and scale, not drop-shadow.
- **No glass morphism**: Solid backgrounds only.
- **Typography scale**: Use the @theme scale in globals.css. No arbitrary sizes.
- **Math visual language**: Every page should have at least one SVG math element
  (graph line, grid, geometric form) that is functional, not decorative.
- **Nepal signal**: Topographic contours, crimson bar, or sun motif — pick one
  per section, not all three.
- **Component source**: Use existing ui/ components (Skeleton, etc.) or build
  inline. No external UI libraries without documenting in docs/ui-migration.md.

## Workflow

1. **Read** design system + existing code
2. **Plan** section structure with TodoWrite
3. **Build** JSX component with Tailwind classes
4. **Add** scroll effects via GSAP ScrollTrigger (sparingly)
5. **Self-check** with skills/critique/SKILL.md
6. **Update** DESIGN.md if new tokens are introduced
7. **Emit** single file change, no scattered edits

## Scroll Effects (Use Sparingly)

Allowed effects:
- Parallax on background images (subtle, max 60px offset)
- Fade-up reveals on section entry (opacity 0→1, y 30→0)
- Line-draw animations for SVG paths (strokeDashoffset)
- Counter animations for stats (odometer-style)

Forbidden effects:
- Pinned scroll hijacking (no scroll-triggered scene changes)
- 3D transforms
- Particle systems (except chalk-dust in hero, already implemented)
- Bouncy/elastic easing

## Output Contract

Produce clean JSX with:
- `'use client'` directive for client components
- Proper prop types (destructure from settings where applicable)
- Accessibility: aria-labels, semantic HTML, reduced-motion support
- No inline styles — Tailwind classes or CSS variables only
