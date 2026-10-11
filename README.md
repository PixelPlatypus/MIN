<div align="center">
  <h1>Mathematics Initiatives in Nepal (MIN)</h1>
  <p>The website and admin panel for MIN, a non-profit that helps students across Nepal learn mathematics and enjoy it.</p>
  <p><a href="https://mathsinitiatives.org.np">mathsinitiatives.org.np</a></p>
</div>

## About the project

The public site covers MIN's programs, events, team, content library, Road to Olympiad guide, DMO practice papers, applications and certificate verification.

The site has its own built-in CMS, so the MIN team can publish content and edit any page without touching the code.

## Stack

- **Next.js 16** (App Router, React 19), deployed on Vercel
- **Tailwind CSS v4**
- **Supabase** for the database, auth and storage
- **Cloudinary** (images), **Resend** (email), **Upstash Redis** (rate limiting)

## Getting started

You need **Node.js 20.9 or newer** and access to a Supabase project.

```bash
git clone https://github.com/PixelPlatypus/MIN.git
cd MIN
npm install
cp .env.example .env.local   # fill in the keys
npm run dev                  # http://localhost:3000
```

To set up a fresh database, follow the [Supabase setup guide](./supabase/example_migration/README.md).

Never commit `.env.local` or real keys. It is already git-ignored.

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/): `type: short description`

| Type | For |
|---|---|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `perf:` | Performance improvements |
| `refactor:` | Code changes that don't change behaviour |
| `style:` | Formatting only |
| `docs:` | Documentation |
| `chore:` | Dependencies, config, tooling |

Example: `fix: stop gallery filters shifting on load`

## Pull requests

1. Create a branch from the latest `main`, named after you and the task:
   ```bash
   git checkout main
   git pull
   git checkout -b your-name/short-description
   ```
2. Commit your work using the convention above.
3. Run `npm run build` and make sure it passes.
4. Push your branch and open a pull request against `main`. Describe what changed, why, and how to test it. For UI changes, add screenshots in light and dark mode.
5. Ask a team member for review. Don't merge your own PR.

## Contributions welcome

Anyone is welcome to contribute, from first-time coders to experienced developers. If you spot a bug or have an idea, open an issue or a pull request and someone from the team will get back to you.

Thank you for helping more students in Nepal enjoy mathematics. 💙
