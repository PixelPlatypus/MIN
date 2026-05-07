# UI Framework Migration Plan

Current state and potential paths forward.

## Current Stack (As of 2026-05-04)

- **Framework**: Next.js 16 App Router
- **Styling**: Tailwind CSS 4 with `@theme` block in `globals.css`
- **Animation**: GSAP + ScrollTrigger (loaded dynamically), Framer Motion (lightweight reveals)
- **Components**: Hand-rolled in `components/ui/` and `components/public/`
- **Design System**: Custom `design-systems/min/DESIGN.md` + `globals.css` tokens
- **Icons**: Lucide React
- **Fonts**: Plus Jakarta Sans (display + body), JetBrains Mono (mono)

## Why We Didn't Use shadcn/ui (Yet)

shadcn/ui is a collection of copy-paste components built on Radix UI primitives + Tailwind. It is excellent for:
- Dashboards with complex forms, tables, and data entry
- Admin interfaces with dialogs, dropdowns, and command palettes
- Teams that need consistent component patterns out of the box

It is less ideal for:
- Highly bespoke marketing/public sites where every pixel is intentional
- Projects with strict zero-rounded-corners / zero-shadow policies
- Sites where decorative patterns (math graphs, topographic contours) are primary

MIN's public site is in the second category. We don't need 40 form primitives. We need:
- Precise typographic control
- Custom SVG math decorations
- Scroll-driven animations
- A design language that doesn't look like every other shadcn site

## Future Migration Path (If Needed)

### Phase 1: Inventory (No code changes)

Catalog what we actually use vs. what shadcn provides:

| Our Need | shadcn Equivalent | Priority |
|----------|-------------------|----------|
| Skeleton | `components/ui/skeleton` | Low — ours is 3 lines |
| Dialog/Modal | `components/ui/dialog` | Medium — needed for admin |
| Form inputs | `components/ui/input`, `select`, `textarea` | Medium — admin forms |
| Data table | `components/ui/table` | Low — not used in public site |
| Tabs | `components/ui/tabs` | Low — not used in public site |
| Toast | `components/ui/sonner` | Medium — useful globally |
| Calendar | `components/ui/calendar` | Low — not needed yet |

**Verdict**: The public site needs almost none of shadcn's components. The admin/dashboard areas would benefit more.

### Phase 2: Selective Adoption (If we proceed)

If we adopt shadcn, we do it selectively:

1. **Only for admin/dashboard routes** — keep public site hand-rolled
2. **Override all default styles** — shadcn defaults use rounded corners and shadows; we would need to fork every component style
3. **Keep our token system** — shadcn uses CSS variables; we already have a `@theme` block. Map shadcn's vars to ours or vice versa.

### Phase 3: Full Integration (Unlikely for public site)

If we ever rebuild the public site with denser UI (e.g., a student portal with forms, dashboards, schedules), then shadcn becomes valuable. Until then, the overhead of maintaining shadcn's component files outweighs the benefits.

## Alternative: Vercel v0 / Lovable / Other

These are AI-assisted UI generators. They are useful for:
- Rapid prototyping of new page layouts
- Generating component starting points

They are NOT useful for:
- Maintaining a consistent design system over time
- Custom scroll animations and SVG decorations
- Fine-grained control over typography and spacing

**Policy**: Do not use v0/Lovable for MIN public pages. Use them for admin dashboard prototyping only, if at all.

## Decision

**Do not migrate to shadcn/ui for the public site.**

The public site is intentionally bespoke. Every section is custom-built to MIN's design system. Adding shadcn would introduce:
- Unnecessary dependencies (Radix UI, class-variance-authority, clsx, tailwind-merge)
- Style conflicts (rounded corners, shadows, default colors)
- Maintenance overhead (upgrading shadcn components, resolving breaking changes)

**Revisit this decision if:**
- We build a student portal, admin dashboard, or data-heavy interface
- We need complex form validation, multi-step wizards, or data tables
- The team grows and we need faster component development at the cost of visual uniqueness

## If We Do Migrate Later

Steps:
1. Run `npx shadcn@latest init` in a feature branch
2. Map shadcn CSS variables to our existing tokens
3. Override default component styles (remove radii, shadows)
4. Install only the components we need (no bulk install)
5. Audit every shadcn component against `skills/critique/SKILL.md`
6. Keep public site components separate from admin components

## Related Files

- `design-systems/min/DESIGN.md` — visual language source of truth
- `skills/ui-component/SKILL.md` — component building rules
- `styles/globals.css` — token definitions
- `components/ui/` — current component inventory
