# Supabase Database Example & Local Setup Guide

Welcome to the MIN project! We have structured our database migrations into modular, numbered files to make them easier to understand and maintain.

## 1. Modular Schema Structure

Inside this `example_migration/` folder, you will find:

1.  **`01_extensions.sql`**: Schema reset and enabling necessary Postgres extensions (`uuid-ossp`, `pgcrypto`).
2.  **`02_tables.sql`**: Full table definitions for the MIN platform.
3.  **`03_functions.sql`**: Postgres functions and triggers for auth, slugification, and auditing.
4.  **`04_rls.sql`**: Activation of Row Level Security and implementation of hardened policies.
5.  **`05_indexes.sql`**: Performance-optimizing indexes for frequent queries.
6.  **`06_seed.sql`**: Generic mock data for testing and development.

## 2. Setup (Supabase SQL Editor)

If you are using the Supabase Web Dashboard, run the files in the following order:

1.  Copy and run **`01_extensions.sql`** through **`05_indexes.sql`** in sequence.
2.  Finally, run **`06_seed.sql`** to populate the database with mock data.

## 3. Local Development (CLI)

If you are using the Supabase CLI, you can consolidate these into a single migration or use them as a reference for your local `supabase/seed.sql`.

### Local Admin Credentials

When you run the seed script, a local admin account is automatically created for testing:

- **Email:** `admin@example.com`
- **Password:** `securepassword123`

> [!CAUTION]
> Never use these credentials in a production environment. Always change default passwords immediately after setup.
