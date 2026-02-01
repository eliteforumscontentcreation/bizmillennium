# Supabase Setup Instructions for Biz Millennium

This guide will walk you through setting up Supabase for the Biz Millennium project from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Configure Environment Variables](#configure-environment-variables)
4. [Run Database Migrations](#run-database-migrations)
5. [Configure Row Level Security (RLS)](#configure-row-level-security-rls)
6. [Create First Admin User](#create-first-admin-user)
7. [Configure Storage Buckets](#configure-storage-buckets)
8. [Testing the Setup](#testing-the-setup)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- A Supabase account (sign up at https://supabase.com)
- Node.js 18+ installed
- pnpm package manager installed
- Git installed

---

## Create Supabase Project

### Step 1: Create a New Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `bizmillennium` (or your preferred name)
   - **Database Password**: Create a strong password (save this securely!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Select your plan (Free tier is sufficient for development)
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

### Step 2: Get Your Project Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API Key** (anon/public key)
   - **Project Reference ID** (from the URL or settings)

---

## Configure Environment Variables

### Step 1: Update .env File

Open the `.env` file in the project root and update with your Supabase credentials:

```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_PUBLIC_KEY"
VITE_SUPABASE_PROJECT_ID="YOUR_PROJECT_ID"
```

**Example:**
```env
VITE_SUPABASE_URL="https://dqdtopxffbhacoqixsnm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_PROJECT_ID="dqdtopxffbhacoqixsnm"
```

### Step 2: Update supabase/config.toml

Update the `supabase/config.toml` file with your project ID:

```toml
project_id = "YOUR_PROJECT_ID"
```

---

## Run Database Migrations

### Option A: Using Supabase SQL Editor (Recommended for First-Time Setup)

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy the contents of each migration file from `supabase/migrations/` in order:
   - `20260130162509_7321a85d-b46f-4326-8b1d-437d294910cd.sql`
   - `20260130164054_63601cac-bafb-42d2-9dee-2b80259bb00d.sql`
   - `20260131134615_4640682b-a193-483e-92be-85052c769187.sql`
   - `20260131134940_4890d5f9-97ac-4a5f-b85b-ee79242d1fc7.sql`
   - `20260201105529_fdb2a12b-519b-4576-a27d-301d628c797b.sql`
   - `20260201110913_c800f9fa-a833-4fa2-916f-241ae45ed3c1.sql`
5. Paste each migration and click **"Run"**
6. Verify no errors appear in the output

### Option B: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push
```

---

## Configure Row Level Security (RLS)

RLS policies are automatically created by the migrations. Verify they're active:

1. Go to **Database** → **Tables** in Supabase Dashboard
2. For each table, click the table name
3. Go to **Policies** tab
4. Verify policies exist for:
   - Public read access (for published content)
   - Admin full access
   - User-specific access (for profiles, applications)

### Key RLS Policies:

- **Public Tables** (read-only): `blogs`, `events`, `gallery`, `testimonials`, `partners`, `brands`
- **Admin Tables** (full CRUD): All content management tables
- **User Tables**: `profiles` (users can view/edit their own), `user_roles` (read-only)
- **Submission Tables**: `contact_submissions`, `job_applications` (insert-only for public)

---

## Create First Admin User

### Step 1: Sign Up a User

1. Run the development server:
   ```bash
   pnpm install
   pnpm run dev
   ```

2. Navigate to `http://localhost:5173/auth`
3. Sign up with your admin email and password
4. Check your email for the confirmation link and confirm your account

### Step 2: Grant Admin Role

1. Go to Supabase Dashboard → **SQL Editor**
2. Run the following query (replace with your email):

```sql
-- Find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';

-- Copy the user ID from the result, then run:
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

**Example:**
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin');
```

### Step 3: Verify Admin Access

1. Log out and log back in to your application
2. Navigate to `/admin` - you should now have access to the admin dashboard

---

## Configure Storage Buckets

### Step 1: Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"**
3. Create the following buckets:

| Bucket Name | Public | Description |
|------------|--------|-------------|
| `avatars` | Yes | User profile avatars |
| `blog-images` | Yes | Blog post featured images |
| `event-images` | Yes | Event photos and banners |
| `gallery` | Yes | Gallery images |
| `brand-logos` | Yes | Brand and partner logos |
| `resumes` | No | Job application resumes (private) |

### Step 2: Configure Bucket Policies

For **public buckets** (avatars, blog-images, event-images, gallery, brand-logos):

1. Click on the bucket name
2. Go to **Policies** tab
3. Add policy: **"Public read access"**
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'bucket-name');
   ```

4. Add policy: **"Authenticated users can upload"**
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'bucket-name');
   ```

For **private buckets** (resumes):

1. Add policy: **"Users can upload their own files"**
   ```sql
   CREATE POLICY "Users can upload resumes"
   ON storage.objects FOR INSERT
   TO public
   WITH CHECK (bucket_id = 'resumes');
   ```

2. Add policy: **"Admins can view all files"**
   ```sql
   CREATE POLICY "Admins can view resumes"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (
     bucket_id = 'resumes' AND
     EXISTS (
       SELECT 1 FROM public.user_roles
       WHERE user_id = auth.uid() AND role = 'admin'
     )
   );
   ```

---

## Testing the Setup

### Step 1: Test Database Connection

```bash
# Run the development server
pnpm run dev
```

Visit `http://localhost:5173` - the homepage should load without errors.

### Step 2: Test Authentication

1. Go to `/auth`
2. Sign up with a test account
3. Verify email confirmation works
4. Log in successfully

### Step 3: Test Admin Access

1. Log in with your admin account
2. Navigate to `/admin`
3. Try creating/editing content in various sections:
   - Blogs
   - Events
   - Gallery
   - Testimonials

### Step 4: Test Public Pages

1. Create a test blog post (mark as published)
2. Visit `/blog` - verify the post appears
3. Test other public pages: `/events`, `/gallery`, `/careers`

---

## Troubleshooting

### Issue: "Failed to fetch" or Connection Errors

**Solution:**
- Verify your `.env` file has the correct Supabase URL and API key
- Check that your Supabase project is active (not paused)
- Ensure you're using the **anon/public key**, not the service role key

### Issue: RLS Policy Errors

**Solution:**
- Check that RLS is enabled on all tables
- Verify policies exist in the Supabase Dashboard
- For admin access issues, confirm the user has the 'admin' role in `user_roles` table

### Issue: "User not found" or Auth Errors

**Solution:**
- Confirm email verification is complete
- Check the `auth.users` table in Supabase Dashboard
- Verify the user has a corresponding entry in `profiles` and `user_roles` tables

### Issue: Storage Upload Failures

**Solution:**
- Verify storage buckets are created
- Check bucket policies allow uploads
- Ensure file size is within limits (default: 50MB)

### Issue: Migration Errors

**Solution:**
- Run migrations in order (by timestamp in filename)
- Check for syntax errors in SQL
- If a migration fails, fix the error and re-run
- Use `supabase db reset` to start fresh (WARNING: deletes all data)

---

## Additional Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Row Level Security Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Storage Guide**: https://supabase.com/docs/guides/storage
- **Project Documentation**: See `docs/SUPABASE_SETUP.md` for detailed schema information

---

## Support

If you encounter issues not covered in this guide:

1. Check the Supabase Dashboard logs (Logs & Analytics section)
2. Review browser console for client-side errors
3. Consult the project's existing documentation in `docs/`
4. Contact the development team

---

## Next Steps

After completing the setup:

1. ✅ Configure email templates in Supabase Dashboard (Auth → Email Templates)
2. ✅ Set up custom domain (if needed) in Project Settings
3. ✅ Configure OAuth providers (Google, GitHub, etc.) if required
4. ✅ Add sample data for testing
5. ✅ Set up automated backups (Project Settings → Database → Backups)
6. ✅ Review and adjust RLS policies for your specific security requirements

---

**Setup Complete!** 🎉

Your Supabase backend is now fully configured and ready for development.