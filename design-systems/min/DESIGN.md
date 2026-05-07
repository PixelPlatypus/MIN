# MIN Design System v2

Mathematics Initiatives in Nepal — Public Website

---

## LIKED
- Deep teal palette as the single brand background (`#1C5D6E`)
- Yellow-gold headlines (`#F0E89C`), bright accent (`#FFF89E`) for 1-2 words
- Marigold (`#D8A73A`) for warm decorative accents, icons, hover states
- Sari red (`#D4253E`) for CTAs and error states
- Cormorant Garamond italic for identity, Space Grotesk for labels, Noto Sans for body
- "Elevating Nepal Through Mathematics" hero headline with accent on "Nepal"
- Hero features grid (Discover Talent, Train Champions, Build Community, Bridge the Gap)
- Animated backgrounds — slowly drifting gradient blobs, subtle grain texture
- The actual Nepal flag SVG as the sole national motif, hero only
- Floating math glyphs (∫, ∇, ƒ) at 3-4% opacity in the hero — tasteful, quiet
- Integral curve that draws across the hero on scroll
- GSAP for scroll-driven parallax and timeline draw animations
- Voronoi mesh canvas in hero background
- Grid paper backgrounds (math-grid) for stats sections
- NepalBar (vertical marigold accent) on left edge of major sections
- Corner bracket SVGs for decorative framing
- Himalayan contour SVGs in mission section
- Sun motif SVG in Join section
- Marquee animation for team strip
- Pill-shaped chip labels (pill utility class)
- Generous whitespace between sections
- Staggered content entrance animations on scroll
- The original hero subtitle: "Igniting curiosity and fostering excellence across Nepal..."

## DISLIKED
- **Math symbols as wallpaper** — the original had `MathMarginalia` everywhere. Vertical math text in margins on every section feels desperate and pedantic. Math belongs in the hero as flavor, not as decoration on every scroll.
- **Sharp/zero-radius corners everywhere** — felt like a "cheap window screen." Replaced with Apple-like rounded corners across the entire site.
- **The `M∫Π` text logo** — a text hack using unicode glyphs. Feels like a placeholder, not a logo. Replaced with actual SVG mark in yellow-gold (`#F0E89C`) on transparent background.
- **HundrED badge in hero corner** — overlapped with navbar. Removed entirely.
- **"Scroll" text indicator** — out of place on a modern page. Removed.
- **ThemeToggle** — a sun/moon toggle that did absolutely nothing (no light mode styles). Removed.
- **`glass` class** — a utility that never existed in this codebase. Made popups transparent. Replaced with `bg-surface border`.
- **`dark:` Tailwind variants** — dead weight since the site has no light mode. Stripped from all public code.
- **Preloader countdown** — blocks the experience. Removed.
- **`rounded-full` on everything** — old design used it for badges, dots, buttons indiscriminately. Replaced with `pill` utility or `rounded-xl` depending on context.
- **`bg-primary`/`text-primary` tokens** — irrelevant. Replaced with `bg-headline`/`text-headline`.
- **National motifs outside hero** — Nepal flag double-triangle appeared in multiple sections. Confined to hero only.
- **`shadow-2xl`/`shadow-xl`/`shadow-sm`** — unnecessary decorative shadows. Removed.
- **Math graph SVGs as wallpaper** — function curves in Timeline, ProgramsGrid, and Hero that felt like filler. Replaced with a single purposeful integral curve in the hero.

---

## 1. Visual Theme & Atmosphere

MIN is a Nepali nonprofit teaching mathematics. The design must feel:

- **Immersive** — alive backgrounds, subtle motion, grain texture. The page breathes.
- **Important** — bold typography, confident spacing, clear narrative. The cause matters.
- **Mathematical** — floating glyphs, integral curves, graph grids. Tasteful, not wallpaper.
- **Nepali** — the actual flag in hero only. Warm marigold highlights. Subtle Devanagari.
- **Accessible** — high contrast on deep teal. Clear hierarchy. Honest content.

The deep teal background dominates. Gradients and grain add depth without changing the color.

---

## 2. Color Palette

### Core

| Token | Hex | Role |
|-------|-----|------|
| `--color-bg` | `#1C5D6E` | Page background |
| `--color-bg-secondary` | `#164B59` | Depth, hover, alternating sections |
| `--color-bg-tertiary` | `#134551` | Deepest teal |
| `--color-surface` | `#1F6B7E` | Cards, overlays |
| `--color-border` | `rgba(255,255,255,0.10)` | Dividers, card borders |
| `--color-border-strong` | `rgba(255,255,255,0.20)` | Stronger dividers |

### Text

| Token | Hex | Role |
|-------|-----|------|
| `--color-text-primary` | `#FFFFFF` | Body text |
| `--color-text-secondary` | `rgba(255,255,255,0.75)` | Descriptions |
| `--color-text-tertiary` | `rgba(255,255,255,0.50)` | Metadata, labels |

### Emphasis

| Token | Hex | Role |
|-------|-----|------|
| `--color-headline` | `#F0E89C` | Headlines, primary emphasis |
| `--color-accent` | `#FFF89E` | 1-2 words per screen — the exact words you want the eye to land on |
| `--color-marigold` | `#D8A73A` | Warm highlights, icons, hover states, decorative elements |
| `--color-sari-red` | `#D4253E` | CTAs, error states |

### Rules
- Accent (#FFF89E) is for 1-2 words per screen. Overuse kills it.
- Marigold is the default decorative accent.
- Sari red is for CTAs and errors only.
- No color should appear that isn't in this palette.

---

## 3. Typography

### Three-Tier System

| Tier | Font | Use | Style |
|------|------|-----|-------|
| Identity | Cormorant Garamond | Logo only | Italic, weight 600 |
| Institutional | Space Grotesk | Section labels, metadata, uppercase captions | 300-400, all caps, tracking 0.2em |
| Content | Noto Sans | Body, descriptions, buttons, labels | 400-600 |
| Mono | JetBrains Mono | Code, math notation | 400 |

### Scale

| Level | Size | Weight | Tracking | Leading | Use |
|-------|------|--------|----------|---------|-----|
| Hero | `clamp(3.5rem, 11vw, 10rem)` | 900 | -0.03em | 0.9 | Hero headlines |
| H1 | `4rem`-`8rem` | 800-900 | -0.03em | 1.05 | Section headlines |
| H2 | `3rem`-`4rem` | 700 | -0.03em | 1.1 | Sub-headlines |
| H3 | `1.25rem`-`1.5rem` | 700 | -0.02em | 1.2 | Card titles |
| Body | `1rem` (16px) | 400 | 0 | 1.65 | Paragraphs |
| Body Lg | `1.125rem` (18px) | 400 | 0 | 1.65 | Lead paragraphs |
| Label | `0.625rem`-`0.75rem` | 400 | 0.2em | 1.4 | Institutional labels |
| Stat | `5rem`-`8rem` | 900 | -0.03em | 1 | Impact numbers |

### Rules
- Headlines use negative tracking for tight lockups.
- Labels use institutional font with positive tracking.
- No text below 10px.
- Dynamic text tokens (`--color-text-*-dynamic`) exist for future theme support but currently resolve to single values.

---

## 4. Shape Language

### Rounded — Apple-like

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Inputs |
| `--radius-lg` | 16px | Medium cards |
| `--radius-xl` | 24px | Buttons, cards, icon containers |
| `--radius-2xl` | 32px | Large cards, sections |

### Utility Classes

| Class | Description |
|-------|-------------|
| `.pill` | Fully rounded chip/label (9999px radius, subtle border, 4% bg) |
| `.card` | Surface bg + border + rounded-xl |
| `.rule` | 1px horizontal divider |
| `.math-grid` | 60px graph paper grid background |
| `.font-institutional` | Space Grotesk, uppercase, 0.2em tracking |
| `.font-identity` | Cormorant Garamond, italic |

### Rules
- Buttons: `rounded-xl`
- Cards: `rounded-2xl`
- Sections/containers: `rounded-2xl` or `rounded-3xl`
- Icon containers: `rounded-xl`
- Chip labels: use `.pill` class
- NO `rounded-full` in component markup — use `.pill` instead
- NO `glass` class — it never existed
- NO `dark:` variants — the site has one color mode
- NO `shadow-*` classes — depth through color and scale, not shadows

---

## 5. Component Patterns

### Buttons

```
Primary (bg-headline):
  bg: #F0E89C
  text: #1C5D6E
  padding: py-4 px-8
  font: 14px semibold, tracking-wide
  border-radius: rounded-xl
  hover: bg-accent (#FFF89E), subtle glow (shadow-accent/25)

Secondary (border):
  border: 1px solid rgba(255,255,255,0.10)
  text: text-text-secondary-dynamic
  border-radius: rounded-xl
  hover: text-headline, border-headline/40
```

### Cards

```
Standard card:
  bg: surface
  border: 1px solid border
  border-radius: rounded-2xl
  padding: p-5 to p-8
  hover: border-headline/20 or border-marigold/20

Large section card:
  border-radius: rounded-3xl
  padding: p-10 md:p-16
```

### Hero (Homepage)

```
Background: VoronoiCanvas (opacity-35), math-grid (opacity-[0.06])
Gradient blobs: 3 drifting blobs via GSAP, fixed, -z-10
Grain: feTurbulence SVG, 4% opacity, mix-blend-mode overlay
Nepal flag: Inline SVG at 15% opacity, wavy perspective animation (8s), scroll-driven rotation via GSAP
Math glyphs: ∫, ∇, ƒ — floating at 3-4% opacity, serif, positioned around hero
Integral curve: SVG bezier path that draws via GSAP ScrollTrigger strokeDashoffset
Content: Pill badge → massive headline → subtitle → CTA button + founded badge → 2×2 features grid → stats strip
```

### Section Heroes (sub-pages)

```
Pattern: pt-36 pb-12, max-w-3xl centered
Pill badge with icon → H1 headline → description paragraph
Optional: CTA button
```

### Filters

```
Active: bg-headline text-bg rounded-xl
Inactive: border border-border rounded-xl text-text-secondary-dynamic
Hover: text-headline border-headline/40
```

### Empty States

```
Container: rounded-2xl border border-border bg-surface
Text: text-text-secondary-dynamic
Optional: CTA link
```

### Form Inputs

```
Input: bg-bg-secondary border border-border rounded-xl
Text: text-text-primary-dynamic
Placeholder: text-text-tertiary-dynamic
Focus: border-headline/50
Error: border-sari-red/50
```

---

## 6. Motion Principles

### GSAP (for meaningful motion)
- Gradient blob drift: `sine.inOut`, yoyo repeat, 18-24s duration
- Scroll parallax: hero content and flag shift on scroll
- Stroke draw: timeline center line, integral curve draw on scroll
- Staggered reveals: programs list, timeline items, feature cards
- Count-up: stat numbers animate on viewport entry

### CSS Animations (for ambient motion)
- Nepal flag wave: `perspective()` rotateY/rotateX, 8s infinite
- Floating glyphs: translate + rotate, 12-16s infinite
- Pulse: marigold dot in hero pill badge
- Marquee: team strip horizontal scroll, 35s linear

### Rules
- Motion confirms, never performs.
- Respect `prefers-reduced-motion`.
- No scroll hijacking.
- No particle systems (Voronoi mesh is the exception).
- All animations are GPU-composited (`will-change-transform`, `transform` only).

---

## 7. What Lives Where

| Element | Location | Purpose |
|---------|----------|---------|
| Nepal flag | Hero only | National identity |
| Floating math glyphs (∫ ∇ ƒ) | Hero only | Mathematical flavor |
| Integral curve | Hero only | Math aesthetic, scroll-driven |
| Voronoi mesh | Hero only | Background depth |
| Gradient blobs | Entire page (fixed) | Ambient motion |
| Grain texture | Entire page (fixed) | Tactile quality |
| NepalBar | Major sections | Structural accent |
| Corner brackets | Section framing | Decorative framing |
| Himalayan contour | Mission section | Nepal geography |
| Sun motif | Join section | Energy, invitation |
| Grid paper | Stats section | Graph paper aesthetic |
| Math-grid | Hero, Stats, Join | Subtle grid texture |

---

## 8. Page Structure

### Homepage
```
1. Hero (full viewport)
   - Voronoi + grid + gradient blobs + grain
   - Nepal flag (wavy, scroll-responsive)
   - Math glyphs (∫ ∇ ƒ)
   - Integral curve (draws on scroll)
   - Content: badge → headline → subtitle → CTA → features → stats
2. Mission (border-y, bg-bg-secondary/30)
   - Pill badge → Nepali text → headline → description → blockquote
   - Image: aspect-[16/10], rounded-3xl
3. Stats (border-b, GridPaper)
   - Centered layout, massive numbers (text-7xl/8xl), GSAP count-up
4. Programs (border-t)
   - Numbered list (01-04), name + tagline, ArrowUpRight on hover
5. Timeline (bg-bg-secondary/30)
   - Alternating items, marigold center line (draws on scroll)
6. Recognition (border-y, bg-bg-secondary/30)
   - Centered, "HundrED Top 100" headline, CTA, stats row
7. TeamStrip (border-y)
   - CSS marquee, rounded-2xl photo cards, gradient fade edges
8. JoinUsCTA (border-y, bg-bg-secondary/30)
   - Ambient glow, math-grid, two buttons, footer text
```

### Section Alternation
Sections alternate between:
- `bg-bg` (default) → `bg-bg-secondary/30` (tinted) → `bg-bg` → etc.
- `border-y` on tinted sections, `border-t` or `border-b` on others
- This creates visual rhythm without any two adjacent sections looking identical

---

## 9. Anti-Patterns (Never Do)

- Never use `glass` class — it does not exist
- Never use `dark:` variants — no light mode
- Never use `bg-primary`/`text-primary`/`border-primary` — use headline tokens
- Never use `rounded-full` on components — use `.pill` or `rounded-xl`
- Never add math marginalia to every section — math lives in the hero
- Never add Nepal motifs outside the hero
- Never use decorative shadows (`shadow-*`)
- Never add a loading screen between the user and content
- Never make the logo black or any color except `#F0E89C`
- Never use `container mx-auto` — use `px-6 md:px-12 lg:px-20` for alignment with navbar
- Never import `ThemeToggle` — it's removed
- Never use `MathMarginalia` for vertical math text — removed from all sections

---

## 10. Dynamic Color Tokens

These exist for potential future theme support. Currently all resolve to single values:

| Token | Resolves to |
|-------|-------------|
| `--color-bg-dynamic` | `--color-bg` |
| `--color-text-primary-dynamic` | `--color-text-primary` |
| `--color-text-secondary-dynamic` | `--color-text-secondary` |
| `--color-text-tertiary-dynamic` | `--color-text-tertiary` |
| `--color-bg-secondary-dynamic` | `--color-bg-secondary` |
| `--color-border-dynamic` | `--color-border` |

All markup must use the `-dynamic` variants so that if a light mode is added, colors switch automatically.

---

## 11. Build & Verify

```bash
npm run build   # Must compile with zero errors
npm run dev     # Start dev server on port 3000
```

All 57 routes must compile. No warnings about unused imports. No runtime errors.
