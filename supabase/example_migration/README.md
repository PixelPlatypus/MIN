# Supabase Database Example & Local Setup Guide

Welcome to the MIN project! To help you get up to speed quickly, we've structured our database schemas and dummy data using Supabase's native configuration.

## 1. Automated Setup (Supabase CLI)
Using the local CLI environment (`npx supabase start`), you need to build the initial schema. You can do this by executing `schema.sql` directly using `supabase db reset`, or by creating a new migration file and pasting `schema.sql` into it so `npx supabase start` runs it natively.

## 2. Manual Setup (Copy & Paste for Web Dashboard Contributors)
If you do not want to use the local CLI and instead prefer to spin up a project via the [Supabase Web Dashboard](https://supabase.com/dashboard/projects), you must install the tables and Row Level Security (RLS) rules *first*!

Inside this `example_migration/` folder, you will find:
1. **`schema.sql`**: We consolidated all 40+ migration steps into this single file. Copy the entire contents of this file and run it inside the Supabase SQL Editor. This will instantly build all the tables, configure foreign keys, establish Row Level Security policies, and define permissions.
2. **`seed_data.sql`**: **Only after running `schema.sql`**, copy the contents of `seed_data.sql` and run it in the SQL Editor. This gives you realistic, robust initial mock data corresponding to all MIN functionality.

## 3. Dummy Data (CLI Seed Integration)
If using the CLI, copy the contents of `supabase/example_migration/seed_data.sql` into the official Supabase seed file located at: `supabase/seed.sql`. This will automatically run every time the CLI resets the database.

*(If `seed.sql` doesn't exist yet, simply copy the file over: `cp supabase/example_migration/seed_data.sql supabase/seed.sql`)*

### Starting the Database (CLI)
Once configured, run:
```bash
npx supabase db reset
```

This will automatically create the tables from the `migrations/` folder and populate them with the dummy content for your local frontend to fetch!

## 3. Local Admin Credentials
When you run the seed script, a local admin account is automatically created so you can access the Site Nexus and dashboard functionality without having to manually patch the database.

**Login URL:** `http://localhost:3000/login`
- **Username:** `admin`  *(or Email)*
- **Email:** `admin@mathsinitiatives.org.np`
- **Password:** `password123`
