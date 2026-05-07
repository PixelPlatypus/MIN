# MIN Design System

Mathematics Initiatives in Nepal — Public Website

---

## 1. Visual Theme & Atmosphere

MIN is a Nepali nonprofit teaching mathematics to students across Nepal.
The design must feel:

- **Mathematical**: precise grids, geometric forms, function graphs, coordinate systems
- **Nepali**: warm earth tones, marigold highlights, subtle Devanagari touches
- **Impactful**: bold typography, confident spacing, no decoration without purpose
- **Scholarly**: serif identity mark, institutional metadata, humanist reading text
- **Accessible**: high contrast on deep teal, clear hierarchy, respectful of low-bandwidth

The atmosphere is serious but warm — like a good teacher. Not corporate, not playful.
The deep teal background (#1C5D6E) dominates ~95% of the experience.

---

## 2. Color Palette & Roles

### Core Palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-bg` | `#1C5D6E` | Page background — deep teal, 95% of the time |
| `--color-bg-secondary` | `#164B59` | Darker teal — depth, hover states |
| `--color-bg-tertiary` | `#134551` | Deepest teal — borders, shadows |
| `--color-surface` | `#1F6B7E` | Slightly lighter teal — cards, overlays |
| `--color-text-primary` | `#FFFFFF` | White — body text |
| `--color-text-secondary` | `rgba(255,255,255,0.75)` | Descriptions, subheadings |
| `--color-text-tertiary` | `rgba(255,255,255,0.50)` | Metadata, captions, labels |
| `--color-border` | `rgba(255,255,255,0.10)` | Dividers, rules |
| `--color-border-strong` | `rgba(255,255,255,0.20)` | Stronger dividers |

### Headlines & Identity

| Token | Hex | Role |
|-------|-----|------|
| `--color-headline` | `#F0E89C` | Pale yellow — headlines, M∫Π mark, primary emphasis |
| `--color-accent` | `#FFF89E` | Bright yellow — **1-2 words max per screen**. Use for the exact words you want the eye to land on |

### Secondary Accents (use sparingly)

| Token | Hex | Role |
|-------|-----|------|
| `--color-sari-red` | `#D4253E` | Sari red — CTAs, error states, rare emphasis |
| `--color-marigold` | `#D8A73A` | Marigold — warm highlights, decorative corners, hover states |
| `--color-lotus-pink` | `#E87A96` | Lotus pink — rare, soft accents |
| `--color-diya-flame` | `#F5B942` | Diya flame — energy moments, stat highlights |

### Rules

- Background is always solid #1C5D6E. No gradients.
- One headline color per screen: #F0E89C.
- Accent (#FFF89E) is for 1-2 words maximum. Overusing it kills its function.
- Marigold (#D8A73A) is the default decorative accent for corners, borders, and hover states.
- Sari red (#D4253E) is for CTAs and rare emphasis only.

---

## 3. Typography Rules

### Three-Tier System

**1. Identity voice** — *refined serif, italic, mathematical/scholarly DNA*
- Font: Cormorant Garamond
- Use: Logo mark (M∫Π) only
- Weight: 600, italic
- Communicates: rigor and tradition

**2. Institutional voice** — *thin geometric sans, all caps, widely tracked*
- Font: Space Grotesk
- Use: Organization name, section labels, metadata, uppercase captions
- Weight: 300-400, uppercase, letter-spacing: 0.15-0.2em
- Communicates: restraint and seriousness

**3. Content voice** — *humanist bilingual sans (Devanagari + Latin from same family)*
- Font: Noto Sans
- Use: Everything the audience actually reads — body text, descriptions, buttons
- Weight: 400-600
- Communicates: warmth and accessibility

### Scale

| Level | Size | Weight | Letter-spacing | Line-height | Use |
|-------|------|--------|----------------|-------------|-----|
| Hero | `clamp(3.5rem, 11vw, 10rem)` | 900 | -0.03em | 0.9 | Hero headlines |
| H1 | `4rem` (64px) | 800 | -0.03em | 1.05 | Section headlines |
| H2 | `3rem` (48px) | 700 | -0.03em | 1.1 | Sub-sections |
| H3 | `1.5rem` (24px) | 700 | -0.02em | 1.2 | Card titles |
| Body | `1rem` (16px) | 400 | 0 | 1.65 | Paragraphs |
| Body Large | `1.125rem` (18px) | 400 | 0 | 1.65 | Lead paragraphs |
| Label | `0.75rem` (12px) | 400 | 0.2em | 1.4 | Institutional labels, all caps |
| Stat | `3rem`–`5rem` | 900 | -0.03em | 1 | Numbers, counters |

### Rules

- Headlines use negative letter-spacing for tight, confident lockups.
- Labels use positive letter-spacing with institutional font for breath and hierarchy.
- No text smaller than 12px.
- Maximum line length: 65 characters.
- Devanagari text is limited — use as marginalia or small annotations only.

---

## 4. Component Stylings

### Buttons

```
Primary:
  bg: #F0E89C (headline)
  text: #1C5D6E (bg)
  padding: 32px horizontal, 16px vertical
  font: 14px semibold, tracking-wide (content voice)
  hover: bg-accent (#FFF89E)
  transition: opacity or bg-color 300ms
  radius: 0

Secondary:
  border: 1px solid #F0E89C
  text: #F0E89C
  hover: bg-headline, text-bg
  radius: 0

Text-only:
  text: white/75
  hover: text-headline
```

### Cards (Avoid When Possible)

When cards are necessary:
- Border: 1px solid rgba(255,255,255,0.10)
- Background: #1C5D6E or #1F6B7E
- Radius: 0
- Shadow: none
- Hover: border-color brightens OR background shifts to #1F6B7E

### Rules / Dividers

```
Standard rule:
  height: 1px
  background: rgba(255,255,255,0.10)

Strong rule:
  height: 1px
  background: rgba(255,255,255,0.20)

Section separator:
  border-top: 1px solid rgba(255,255,255,0.10)
```

### Corner Brackets

L-shaped SVG brackets in marigold (#D8A73A) at 15-40% opacity.
Placed at section corners as decorative frames.

### Nepal Bar

A 4px-wide vertical bar in marigold (#D8A73A), placed on the left edge of major sections.
Opacity: 80%. Quiet structural signal.

---

## 5. Layout Principles

### Grid & Spacing

- Container max-width: 1280px
- Section padding: `py-24` (96px) to `py-40` (160px)
- Content padding: `px-6` mobile, `px-12` tablet, `px-20` desktop
- Gap between sections: each section controls its own breathing room

### Section Rhythm

1. **Hero**: Full viewport, massive type, Voronoi mesh background, math graph SVG, stats strip
2. **Stats**: Graph paper background, horizontal typographic strip, equation bar
3. **Content sections**: Asymmetric splits with coordinate axes overlays
4. **Lists**: Vertical with numbered items, thin rules between
5. **CTA**: Centered, massive type, sun motif background, single action

### Responsive

- Mobile: single column, reduced padding, stacked layouts
- Tablet: 2-column grids
- Desktop: asymmetric splits, horizontal scroll galleries, parallax

---

## 6. Depth & Elevation

- **No shadows**. Depth through:
  - Scale (larger elements feel closer)
  - Parallax (background slower than foreground)
  - Overlap (image bleeds beyond container)
  - Color contrast (teal depth variations)

---

## 7. Do's and Don'ts

### Do

- Use real photos of MIN events, students, team members
- Use SVG math graphs representing real functions
- Use the accent (#FFF89E) with extreme restraint (1-2 words per screen)
- Use generous whitespace
- Use Devanagari sparingly — marginalia, small annotations
- Use `oklch()` for color derivations when needed

### Don't

- No rounded corners (radius: 0 everywhere)
- No gradients on backgrounds
- No glass morphism or blur effects
- No decorative shadows
- No generic stock photos or AI-generated people
- No emoji as feature icons
- No lorem ipsum or fake statistics
- No overuse of accent yellow — it kills its function
- No pinned scroll hijacking
- No particle systems (hero chalk-dust is the exception)

---

## 8. Responsive Behavior

### Breakpoints

- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px

### Mobile Rules

- Horizontal galleries become vertical lists
- Parallax disabled
- Counters animate on viewport entry
- Nepal bar hidden
- Sun motif reduced to 50%
- Devanagari marginalia hidden

### Tablet Rules

- 2-column grids for stats and features
- Asymmetric splits become 50/50
- Programs list becomes 2-column grid

### Desktop Rules

- Full asymmetric layouts
- Parallax enabled
- All decorative SVGs visible
- Devanagari marginalia visible

---

## 9. Agent Prompt Guide

When building or modifying MIN public UI:

1. **Read this DESIGN.md first.** All tokens and rules live here.
2. **Read the critique skill** at `skills/critique/SKILL.md` before shipping.
3. **When in doubt, subtract.** Remove an element rather than add one.
4. **Derive, don't invent.** Use existing tokens.
5. **One accent per screen.** Pick marigold OR headline yellow for emphasis, not both fighting.
6. **Math first, Nepal second.** Mathematical visual language is primary; national signal is secondary.
7. **Typography carries the page.** Scale, weight, and rhythm create hierarchy.
8. **Motion confirms, never performs.** Animation serves orientation and feedback.
9. **Honest placeholders.** Use `—` or grey blocks instead of fake content.
10. **Fail fast.** No safely run-to-completion logic.
11. **Accent budget:** #FFF89E is for 1-2 words maximum per viewport. Count them.
12. **Institutional voice for labels:** All section labels, metadata, and captions use Space Grotesk, all caps, wide tracking.
13. **Identity voice for logo:** The M∫Π mark uses Cormorant Garamond italic only.
14. **Content voice for reading:** All body text uses Noto Sans.
