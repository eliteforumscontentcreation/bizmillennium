# Supabase Migration Instructions

## Important: Apply New Migration

A new database migration has been created to support customizable service forms. You **MUST** apply this migration to your Supabase database for the feature to work.

## Migration File
`/supabase/migrations/20260204000000_create_service_form_fields.sql`

## How to Apply the Migration

### Option 1: Using Supabase Studio (Recommended)

1. Log in to your Supabase project at https://supabase.com/dashboard
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy the entire contents of `/supabase/migrations/20260204000000_create_service_form_fields.sql`
5. Paste into the SQL Editor
6. Click **"Run"** to execute the migration
7. Verify success - you should see "Success. No rows returned"

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to project directory
cd /workspace/bizmillennium

# Link to your Supabase project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
supabase db push

# Or apply migrations manually
supabase db reset
```

### Option 3: Manual SQL Execution

1. Open your Supabase project dashboard
2. Go to **Database** → **Tables**
3. Click on **SQL Editor** tab
4. Create a new query
5. Copy and paste the migration SQL
6. Execute the query

## What This Migration Does

1. **Creates `service_form_fields` table**
   - Stores customizable form field configurations
   - Supports different field types (text, email, tel, textarea, number, url, date)
   - Allows field ordering, activation/deactivation

2. **Adds `form_data` column to `service_contact_submissions`**
   - Stores all form field values as JSONB
   - Maintains backward compatibility with existing columns

3. **Sets up Row Level Security (RLS)**
   - Public users can view active fields and submit forms
   - Authenticated users can manage field configurations

4. **Inserts default form fields**
   - Pre-populates fields for all service types
   - Includes: name, email, phone, company, subject, message

## Verification Steps

After applying the migration, verify it worked:

1. **Check Tables Exist**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('service_form_fields', 'service_contact_submissions');
   ```

2. **Check Default Data**
   ```sql
   SELECT service_type, COUNT(*) as field_count
   FROM service_form_fields
   GROUP BY service_type;
   ```
   
   Expected result: 6 fields for each of the 4 service types (24 total)

3. **Check RLS Policies**
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE tablename = 'service_form_fields';
   ```

4. **Test in Admin Panel**
   - Log in to `/admin`
   - Navigate to "Service Form Fields"
   - You should see default fields for each service type

## Rollback (If Needed)

If you need to rollback the migration:

```sql
-- Drop the new table
DROP TABLE IF EXISTS service_form_fields CASCADE;

-- Remove the new column (optional, if you want to revert completely)
ALTER TABLE service_contact_submissions DROP COLUMN IF EXISTS form_data;
```

## Troubleshooting

### Error: "relation already exists"
The table might already exist. Check if it was created previously:
```sql
SELECT * FROM service_form_fields LIMIT 1;
```

### Error: "permission denied"
Ensure you're logged in as a database admin or have sufficient privileges.

### Error: "column already exists"
The `form_data` column might already exist. You can skip that part of the migration.

### No Default Fields Appearing
Re-run the INSERT statements from the migration file to populate default fields.

## Next Steps

After successfully applying the migration:

1. ✅ Test the admin panel at `/admin/service-form-fields`
2. ✅ Customize fields for each service type
3. ✅ Test form submissions on service pages
4. ✅ Check submissions in `/admin/service-contact-submissions`

## Need Help?

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your database connection settings
3. Ensure you have the latest code from the repository
4. Contact the development team for support