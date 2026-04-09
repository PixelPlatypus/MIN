# Contributing to MIN Website

Thank you for your interest in contributing to the Mathematics Initiatives in Nepal website!

## Branch Naming

Use the following prefixes for branches:

| Prefix | Purpose |
|--------|---------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `refactor/` | Code refactoring |
| `docs/` | Documentation |
| `chore/` | Maintenance / config |

**Example:** `feat/certificate-bulk-issue`, `fix/gallery-lightbox-crash`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes and test locally (`npm run dev`)
3. Run `npm run lint` and fix any warnings
4. Commit with descriptive messages:
   ```
   feat: add bulk certificate issuance (#42)
   fix: gallery lightbox crash on mobile Safari
   ```
5. Open a PR against `main`
6. Wait for CI (lint + build) to pass
7. Get at least one review before merging

## Code Style

- **JavaScript** (no TypeScript) — plain `.js` and `.jsx` files
- **Components:** PascalCase filenames (`EventCard.jsx`, `AdminSidebar.jsx`)
- **Utilities:** camelCase filenames (`sanitize.js`, `rateLimit.js`)
- **API Routes:** `route.js` inside Next.js App Router conventions
- **CSS:** Tailwind v4 utility classes + CSS variables in `globals.css`
- **Imports:** Use `@/` path alias for all project imports

## Project Conventions

- All admin API routes use `withRole()` for RBAC
- All admin mutations log to `audit_log` via `logAudit()`
- All DB HTML is sanitized with `sanitizeHtml()` from `lib/sanitize.js`
- Public form submissions use `createAdminClient()` to bypass RLS
- Emails are sent via `sendEmail()` from `lib/resend.js`

## Local Development

```bash
npm install
cp .env.example .env.local  # fill in your values
npm run dev
```

## Questions?

Reach out to the MIN tech team at [contact@mathsinitiatives.org.np](mailto:contact@mathsinitiatives.org.np).
