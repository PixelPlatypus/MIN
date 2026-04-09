# Mathematics Initiatives in Nepal (MIN) — Admin Portal

> Making mathematics accessible, engaging, and inspiring for all students in Nepal.

## Tech Stack

- **Framework:** Next.js 14 (App Router, JavaScript)
- **Styling:** Tailwind CSS v4
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Storage:** Cloudinary (images)
- **Email:** Resend
- **Animations:** GSAP + Framer Motion
- **Rich Text:** TipTap
- **PDF Generation:** @react-pdf/renderer
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase project (with schema applied)
- Cloudinary account
- Resend account

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/min-website.git
cd min-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — Supabase anon key
- `SUPABASE_SECRET_KEY` — Supabase service role key
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY` — Resend API key
- `FROM_EMAIL` — Sender email address
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token for certificate storage
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — Rate limiting

### 4. Database Setup

Run the full SQL schema from `plan.md` in the Supabase SQL editor. This creates all tables, RLS policies, and triggers.

### 5. Seed Admin User

```bash
node scripts/seed.js
```

This creates the first admin user with credentials from your `.env.local`.

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Vercel

```bash
vercel deploy --prod
```

Or connect your GitHub repo to Vercel for auto-deployment on push to `main`.

## User Roles

| Role | Access |
|------|--------|
| **ADMIN** | Full access — users, certificates, notices, analytics, audit log |
| **MANAGER** | Content, events, team, gallery, programs, applications, submissions |
| **WRITER** | Content creation (drafts), content submissions review |

## Project Structure

```
app/
├── (public)/    # Public-facing pages (home, team, events, etc.)
├── (admin)/     # Admin dashboard (role-gated)
├── (auth)/      # Login page
└── api/         # API route handlers

components/
├── public/      # Public UI components
├── admin/       # Admin dashboard components
└── shared/      # Shared utilities (theme, SEO, etc.)

lib/             # Utilities (Supabase, Cloudinary, audit, etc.)
```

## License

© Mathematics Initiatives in Nepal. All rights reserved.
