# Storage Bucket Setup Instructions

## Important: Manual Bucket Creation Required

The storage bucket for gallery images needs to be created manually through the Supabase Dashboard because it requires elevated permissions.

## Steps to Create the Storage Bucket:

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/gpdxbqghobdmmdbslrip
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket** button
4. Configure the bucket:
   - **Name**: `images`
   - **Public bucket**: ✅ **Enable** (check this box)
   - **File size limit**: `5242880` (5MB in bytes)
   - **Allowed MIME types**: Leave empty or add: `image/jpeg, image/jpg, image/png, image/gif, image/webp`
5. Click **Create bucket**

### Option 2: Via Supabase CLI

If you have Supabase CLI installed locally:

```bash
# Create the bucket
supabase storage create images --public

# Set file size limit (5MB)
supabase storage update images --file-size-limit 5242880
```

## After Creating the Bucket

Once the bucket is created, run the migration to set up the security policies:

### Via Supabase Dashboard:
1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file: `supabase/migrations/20260204000001_create_storage_bucket.sql`
3. Copy and paste the SQL content
4. Click **Run**

### Via Supabase CLI:
```bash
supabase db push
```

## Verify the Setup

After completing the above steps:

1. Go to **Storage** > **images** bucket in your Supabase dashboard
2. Try uploading a test image
3. Check that the image is publicly accessible
4. Test the Gallery Admin upload functionality in your application

## Troubleshooting

If you encounter permission errors:
- Make sure you're logged in as the project owner
- Verify the bucket is set to **Public**
- Check that RLS policies are enabled in Storage settings

## Security Notes

The bucket is configured with:
- ✅ Public read access (anyone can view images)
- ✅ Authenticated write access (only logged-in users can upload)
- ✅ 5MB file size limit
- ✅ Image file types only

This is secure for a gallery application where images should be publicly viewable but only admins can upload.