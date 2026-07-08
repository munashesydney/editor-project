---
name: supabase-migrations
description: Instructions for safely creating and running Supabase database migrations in this project. Use whenever making schema changes.
---

# Supabase Migrations

Follow these exact steps when adding tables, columns, or changing the database schema. We do NOT run a local Docker database; we push directly to the linked remote Supabase project.

## When to use this skill
- Modifying the database schema (adding tables, changing columns, setting up RLS).
- Writing database triggers or functions.

## How to use it

### 1. Create a Migration File
Run this command in the terminal to generate a new migration file:
```bash
npx supabase migration new <descriptive_name>
```
*Example: `npx supabase migration new add_users_table`*

This creates a new `.sql` file in `supabase/migrations/`. 

### 2. Write your SQL
Open the generated `.sql` file and write raw SQL.
- Always include `enable row level security` for new tables.
- Write explicit RLS policies (e.g. `create policy ... on public.users for select using (auth.uid() = id);`).
- Do not use the Supabase Studio dashboard to make schema changes; everything must be tracked in SQL migrations.

### 3. Push to Production
Apply the changes directly to the remote Supabase database by running:
```bash
npx supabase db push
```
Since we aren't using a local Docker setup, this command pushes changes straight to the remote project.

## Notes
- Do NOT modify existing migration files that have already been pushed. Always create a new migration to alter the schema.
