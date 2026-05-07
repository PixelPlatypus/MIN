---
name: ui-component
description: |
  Build or modify reusable UI components in the components/ui/ or components/shared/
  directories. Governed by the same design system as web-prototype but focused on
  atomic pieces: buttons, cards, forms, modals, loading states.
triggers:
  - "new component"
  - "button"
  - "modal"
  - "form input"
  - "loading"
  - "skeleton"
  - "card"
od:
  mode: prototype
  platform: desktop
  scenario: design
  design_system:
    requires: true
    sections: [color, typography, components]
---

# MIN UI Component Skill

## Rules

- All components go in `components/ui/` (generic) or `components/shared/` (app-specific)
- Export named functions, not defaults (easier tree-shaking)
- Accept `className` prop for composition
- Use `forwardRef` when the component wraps a single interactive element
- Tailwind classes only — no inline styles, no CSS-in-JS
- Support `data-state` attributes for styling different states

## Button Patterns

```jsx
// Primary
<button className="inline-flex items-center gap-3 bg-text-primary-dynamic text-bg-dynamic px-8 py-4 text-sm font-semibold tracking-wide hover:bg-nepal-crimson transition-colors duration-300">

// Secondary / Ghost
<button className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-text-secondary-dynamic hover:text-text-primary-dynamic transition-colors border border-border-dynamic hover:border-text-primary-dynamic">

// Text-only
<button className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary-dynamic hover:text-nepal-crimson transition-colors">
```

## Form Patterns

- Labels: `text-xs font-semibold tracking-[0.15em] uppercase text-text-tertiary-dynamic mb-2`
- Inputs: `w-full bg-bg-dynamic border border-border-dynamic px-4 py-3 text-sm text-text-primary-dynamic focus:border-nepal-crimson focus:outline-none transition-colors`
- Focus ring: border color change only, no box-shadow ring
- Error state: border-nepal-crimson + text-nepal-crimson helper text

## Card Patterns

Avoid cards where possible. When necessary:
- No border-radius (use `rounded-none` or omit)
- No shadow
- Border: `border border-border-dynamic`
- Hover: `hover:border-text-primary-dynamic` or `hover:bg-bg-secondary-dynamic`
- Padding: consistent with section padding (px-6 md:px-12)

## Loading States

- Skeleton: `bg-border-dynamic animate-pulse` (no shimmer, keep it minimal)
- Spinner: Use lucide `Loader2` with `animate-spin`
- Never block the entire page — section-level skeletons only

## Accessibility

- All interactive elements must be keyboard-focusable
- Color is never the sole indicator of state
- Reduced motion: disable transforms/animations when `prefers-reduced-motion: reduce`
