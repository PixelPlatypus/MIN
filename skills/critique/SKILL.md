---
name: critique
description: |
  Five-dimensional self-critique for MIN public-facing UI. Run this before
  committing any component, page, or CSS change. Scores 1–5 per dimension.
  Any dimension below 3/5 is a regression — fix the weakest, re-score, then ship.
triggers:
  - "critique"
  - "review"
  - "self-check"
  - "slop check"
  - "design review"
  - "before committing"
od:
  mode: template
  scenario: design
  inputs:
    - name: artifact_path
      type: string
      required: true
      description: Path to the component or page being reviewed
---

# MIN UI Self-Critique

Run this checklist against every visual change before it leaves your hands.

## Pre-flight

1. Read the active DESIGN.md at `design-systems/min/DESIGN.md`
2. Read the file(s) being critiqued
3. Check against AGENTS.md design rules
4. Score each dimension 1–5 with evidence

## The Five Dimensions

### 1. Philosophy (Does it match MIN?)
- Does the element feel like it belongs to a Nepali math nonprofit?
- Is the national signal (crimson accent, sun motif, topographic contours) present but restrained?
- Is math visual language (graphs, grids, geometric forms) used with intent?
- **1–2:** Generic SaaS / could be any startup
- **3:** MIN-ish but bland
- **4–5:** Distinctly MIN — Nepal + mathematics + impact, inseparable

### 2. Hierarchy (One focal point per screen/section)
- Is there exactly one dominant element that guides the eye first?
- Does scale, weight, and rhythm create clear reading order?
- Are we using size contrast (not color borders) to separate sections?
- **1–2:** Flat, no focal point, everything competes
- **3:** Clear enough but safe
- **4–5:** Bold, confident hierarchy that tells a story

### 3. Execution (Typography, spacing, alignment)
- No arbitrary values — tokens only (check globals.css @theme)
- Line-height consistent per text role (body 1.65, headlines 1.1)
- Letter-spacing: headlines -0.03em, labels 0.15em uppercase
- No orphaned words in headlines at common breakpoints
- **1–2:** Misaligned, inconsistent spacing, rough edges
- **3:** Clean, professional
- **4–5:** Precise, considered, every pixel earns its place

### 4. Specificity (Every element communicates)
- No decorative fluff that doesn't serve a purpose
- No lorem ipsum, no fake stats, no placeholder content
- Icons used sparingly — only when they add meaning
- Math graphs / SVGs must be real functions or real data
- **1–2:** Filler content, generic icons, decoration without purpose
- **3:** Honest content, some generic patterns
- **4–5:** Every element is specific to MIN's story

### 5. Restraint (Saying no is a design decision)
- One accent color (nepal-crimson) used ≤2× per screen
- No gradients on backgrounds (single warm off-white only)
- No shadows, no glass morphism, no rounded corners
- No animated entrances that don't serve orientation
- **1–2:** Over-designed, ornament-heavy, AI-slop
- **3:** Clean but could be tighter
- **4–5:** Ruthlessly restrained, every omission is intentional

## Anti-AI-Slop Checklist

Check NO for each — any YES is a blocker:

- [ ] No aggressive purple/violet gradients
- [ ] No generic emoji feature icons
- [ ] No rounded card with left colored border accent
- [ ] No hand-drawn SVG humans/faces/scenery
- [ ] No Inter/Roboto/Arial as *display* face
- [ ] No invented metrics without source
- [ ] No filler copy / lorem ipsum
- [ ] No icon next to every heading
- [ ] No gradient on every background
- [ ] Honest placeholder (—, grey block) beats fake stat

## Output Format

```
Philosophy:  X/5 — [one-line evidence]
Hierarchy:    X/5 — [one-line evidence]
Execution:    X/5 — [one-line evidence]
Specificity:  X/5 — [one-line evidence]
Restraint:    X/5 — [one-line evidence]

Anti-slop:    PASS / FAIL — [which check failed]

Verdict:      SHIP / FIX / REJECT
```

## Rules

- Score below 3/5 on any dimension → FIX before shipping
- Anti-slop FAIL → REJECT, do not commit
- When in doubt, subtract
- One thousand no's for every yes
