# Supabase Setup Guide

This document provides instructions for setting up and configuring the Supabase backend for the Biz Millennium project.

## Overview

This project uses **Lovable Cloud** which provides an integrated Supabase backend with:
- PostgreSQL Database
- Row-Level Security (RLS)
- User Authentication
- Edge Functions
- File Storage

## Database Schema

### Tables

The following tables are configured in the database:

| Table | Description |
|-------|-------------|
| `profiles` | User profile information linked to auth.users |
| `user_roles` | Role-based access control (admin, moderator, user) |
| `blogs` | Blog posts with categories and SEO fields |
| `blog_categories` | Categories for organizing blog posts |
| `events` | Event listings with dates, venues, and speakers |
| `event_types` | Types/categories of events |
| `event_speakers` | Speakers associated with events |
| `careers` | Job postings with requirements and responsibilities |
| `job_applications` | Applications submitted for job postings |
| `brands` | Brand/client information with logos |
| `partners` | Partner organizations with logos |
| `testimonials` | Customer testimonials |
| `gallery` | Image gallery with categories |
| `pages` | Dynamic CMS pages |
| `hero_sections` | Hero section content for pages |
| `navigation` | Site navigation menu items |
| `domains` | Business domain categories |
| `statistics` | Site statistics/metrics |
| `site_settings` | Global site configuration |
| `contact_submissions` | Contact form submissions |

### User Roles

The project uses an enum-based role system:

```sql
-- Role types
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);
```

### Security Functions

A security definer function is used to check user roles without recursive RLS issues:

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

## Row-Level Security (RLS)

All tables have RLS enabled with appropriate policies:

### Public Read Access
- `blogs` - Published blogs only
- `events` - All events
- `careers` - Active jobs only
- `gallery` - Active images only
- `testimonials` - Active testimonials only
- `partners` - Active partners only
- `brands` - Active brands only
- `site_settings` - Global settings
- `navigation` - Active menu items

### Admin Access
Admin users (with `admin` role) have full CRUD access to all content tables.

### User Access
- Users can view and update their own profile
- Users can view their own roles
- Anyone can submit contact forms and job applications

## Authentication

### Sign Up Flow
1. User signs up with email and password
2. Confirmation email is sent (auto-confirm disabled by default)
3. Upon confirmation, a trigger creates:
   - A profile in `public.profiles`
   - A default 'user' role in `public.user_roles`

### Trigger for New Users

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Making a User Admin

To make a user an admin, insert their role into the `user_roles` table:

```sql
-- Find user by email (run in SQL editor)
SELECT id FROM auth.users WHERE email = 'admin@example.com';

-- Insert admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

## Environment Variables

The following environment variables are automatically configured:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |

## Client Usage

Import the Supabase client in your components:

```typescript
import { supabase } from "@/integrations/supabase/client";

// Example: Fetch blogs
const { data, error } = await supabase
  .from('blogs')
  .select('*')
  .eq('is_published', true);
```

## Storage Buckets

Storage buckets can be created for:
- User avatars
- Blog images
- Event images
- Gallery photos
- Brand logos

## Edge Functions

Edge functions are automatically deployed and can be created in:
```
supabase/functions/
```

## Best Practices

1. **Never expose admin credentials** in client-side code
2. **Always use RLS policies** for data protection
3. **Use the `has_role` function** for role checks
4. **Store roles in separate table** - never on profiles
5. **Validate on server-side** - never trust client data

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check if user has required role
   - Verify policy conditions

2. **Authentication Failures**
   - Confirm email verification is complete
   - Check for expired sessions
   - Verify redirect URLs

3. **Missing Data**
   - Check if `is_active` or `is_published` filters apply
   - Verify RLS policies allow access

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
