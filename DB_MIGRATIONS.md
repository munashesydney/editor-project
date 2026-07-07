# Supabase Database Migrations

Follow these super simple steps whenever you need to update the database schema (e.g., adding a new table or column).

### 1. Create a Migration File
Run this command in your terminal, replacing `your_migration_name` with a short description (like `add_projects_table`):
```bash
npx supabase migration new your_migration_name
```
*This will create a new `.sql` file inside the `supabase/migrations/` folder.*

### 2. Write your SQL
Open the newly created `.sql` file and write the SQL code for your database changes.

### 3. Push to Production
Once you are happy with the SQL, push the changes to your remote Supabase database by running:
```bash
npx supabase db push
```

---
**Note:** Because we aren't running Docker locally for local database development, `npx supabase db push` simply applies the changes directly to your linked remote Supabase project.
