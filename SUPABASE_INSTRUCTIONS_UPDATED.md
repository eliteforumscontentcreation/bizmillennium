# Supabase Setup Instructions - Updated (February 2026)

This document provides comprehensive instructions for setting up and maintaining the Supabase database for the Biz Millennium project, including the latest enhancements for gallery and events management.

## Table of Contents
1. [Overview of Changes](#overview-of-changes)
2. [Database Schema Updates](#database-schema-updates)
3. [Migration Instructions](#migration-instructions)
4. [Gallery Management Setup](#gallery-management-setup)
5. [Events Management Setup](#events-management-setup)
6. [Testing the New Features](#testing-the-new-features)
7. [Troubleshooting](#troubleshooting)

---

## Overview of Changes

### Recent Enhancements (February 2026)

1. **Gallery Management**
   - Enhanced admin interface for event-based photo management
   - Improved workflow: Create event → Add photos to event
   - Tab-based filtering by event in admin panel
   - Better organization of gallery items

2. **Events Management**
   - Added `registration_url` field for external registration links
   - Created comprehensive event detail pages
   - Registration buttons on event cards
   - Improved event listing with registration CTAs

3. **Services Page**
   - New dedicated Services page combining all service types
   - Tabbed interface for: Conferences, Roundtable, In-House, Data Generation
   - Updated navigation to link to /services instead of /events

---

## Database Schema Updates

### Events Table Enhancement

The `events` table already includes the `registration_url` column. The new migration adds indexes for better performance:

```sql
-- Index on event_id for gallery items
CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON public.gallery(event_id);

-- Index on is_upcoming for filtering
CREATE INDEX IF NOT EXISTS idx_events_is_upcoming ON public.events(is_upcoming);

-- Index on event_date for sorting
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date DESC);
```

### Gallery Table Structure

The gallery table links photos to events:

```sql
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  category TEXT,
  event_id UUID REFERENCES public.events(id),  -- Links to events
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Migration Instructions

### Step 1: Run the New Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy and paste the contents of `supabase/migrations/20260202000000_enhance_events_gallery.sql`
5. Click **"Run"**
6. Verify no errors appear

### Step 2: Verify Indexes

Run this query to check if indexes were created successfully:

```sql
SELECT 
  tablename, 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('events', 'gallery')
ORDER BY tablename, indexname;
```

You should see:
- `idx_gallery_event_id`
- `idx_events_is_upcoming`
- `idx_events_event_date`

---

## Gallery Management Setup

### Workflow for Gallery Management

1. **Create Events First** (in Events Admin)
   - Go to Admin → Events
   - Click "Add Event"
   - Fill in event details (title, date, location, etc.)
   - Save the event

2. **Add Photos to Events** (in Gallery Admin)
   - Go to Admin → Gallery
   - Click "Add Photo"
   - Select the event from dropdown (required)
   - Enter image URL
   - Add caption and alt text
   - Save the photo

3. **Organize by Event**
   - Use the tabs in Gallery Admin to filter photos by event
   - Photos automatically appear on the Gallery page grouped by event
   - Visitors can switch between events using tabs on the frontend

### Best Practices

- Always create the event before adding photos
- Use descriptive captions for accessibility
- Set appropriate sort_order for photo sequence
- Mark photos as "Active" to display on frontend
- Use high-quality images (recommended: 1200x800px or larger)

---

## Events Management Setup

### Adding Registration URLs

1. Go to Admin → Events
2. When creating/editing an event, fill in the "Registration URL" field
3. Example: `https://eventbrite.com/your-event-registration`
4. This URL will appear as a "Register" button on:
   - Event listing cards
   - Event detail pages

### Event Detail Pages

Each event now has its own detail page at `/events/{slug}`:

- **Hero section** with event image and key details
- **Date and location** prominently displayed
- **Full description** and venue information
- **Registration CTA** (if URL provided and event is upcoming)
- **Back to Events** navigation

### Event Status

- **Upcoming Events**: Show registration buttons, appear in "Upcoming" tab
- **Past Events**: No registration button, appear in "Past Events" tab
- Toggle `is_upcoming` in admin to control status

---

## Testing the New Features

### Test Gallery Management

1. **Create a Test Event**:
   ```
   Title: Test Conference 2026
   Date: 2026-06-15
   Location: New York, NY
   ```

2. **Add Test Photos**:
   - Add 3-5 photos linked to the test event
   - Use different captions
   - Set sort_order: 0, 1, 2, 3, 4

3. **Verify Frontend**:
   - Visit `/gallery`
   - Check if event tab appears
   - Click event tab to filter photos
   - Verify photos display correctly

### Test Events with Registration

1. **Create Event with Registration URL**:
   ```
   Title: Annual Summit 2026
   Registration URL: https://example.com/register
   Is Upcoming: Yes
   ```

2. **Verify Registration Flow**:
   - Visit `/events`
   - Find the event card
   - Check "Register" button appears
   - Click to verify external link works
   - Visit `/events/annual-summit-2026`
   - Verify detail page shows registration CTA

### Test Services Page

1. Visit `/services`
2. Check all tabs load correctly:
   - Conferences
   - Roundtable
   - In-House
   - Data Generation
3. Verify links to individual service pages work
4. Test "Contact Us" buttons

---

## Troubleshooting

### Issue: Photos Not Showing in Gallery

**Solution**:
- Check if `event_id` is set for the gallery item
- Verify the event exists in the events table
- Ensure `is_active` is set to `true`
- Check RLS policies allow public read access

### Issue: Registration Button Not Appearing

**Solution**:
- Verify `registration_url` field is filled in
- Check `is_upcoming` is set to `true`
- Clear browser cache and reload
- Check console for JavaScript errors

### Issue: Event Detail Page Shows 404

**Solution**:
- Verify the event `slug` matches the URL
- Check if event exists in database
- Ensure event is not soft-deleted
- Verify routing in App.tsx includes `/events/:slug`

### Issue: Services Page Not Loading

**Solution**:
- Check if route is added in App.tsx
- Verify Services.tsx file exists
- Check for import errors in browser console
- Ensure all service page links are correct

---

## RLS Policies

### Gallery Table Policies

```sql
-- Public read access for active gallery items
CREATE POLICY "Public read access for gallery"
ON public.gallery FOR SELECT
USING (is_active = true);

-- Admin full access
CREATE POLICY "Admin full access to gallery"
ON public.gallery FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

### Events Table Policies

```sql
-- Public read access for events
CREATE POLICY "Public read access for events"
ON public.events FOR SELECT
USING (true);

-- Admin full access
CREATE POLICY "Admin full access to events"
ON public.events FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

---

## Admin Panel Navigation

### Updated Admin Menu Structure

- **Dashboard** - Overview and statistics
- **Events** - Manage events and registration URLs
- **Gallery** - Add photos to events
- **Event Types** - Configure event categories
- **Blogs** - Manage blog posts
- **Careers** - Job postings
- **Testimonials** - Customer reviews
- **Partners** - Partner logos
- **Settings** - Site configuration

---

## Frontend Routes

### New/Updated Routes

```
/services              - Combined services page (NEW)
/events                - Event listing page (UPDATED)
/events/:slug          - Event detail page (NEW)
/gallery               - Gallery with event tabs (UPDATED)
/conferences           - Conferences service page
/roundtable            - Roundtable service page
/in-house              - In-House service page
/data-generation       - Data Generation service page
```

---

## Maintenance Tips

1. **Regular Backups**
   - Enable automated backups in Supabase Dashboard
   - Test restore process periodically

2. **Performance Monitoring**
   - Monitor query performance in Supabase Dashboard
   - Check slow queries and add indexes as needed

3. **Content Updates**
   - Update event status (upcoming → past) after events conclude
   - Archive old gallery photos if needed
   - Keep registration URLs up to date

4. **Security**
   - Regularly review RLS policies
   - Audit admin user access
   - Keep Supabase client library updated

---

## Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Project Schema**: See `supabase/schema.sql`
- **Migration Files**: See `supabase/migrations/`
- **Original Setup Guide**: See `SUPABASE_SETUP_INSTRUCTIONS.md`

---

## Summary of Changes

✅ Enhanced gallery management with event-based organization
✅ Added registration URL field to events
✅ Created comprehensive event detail pages
✅ Built dedicated Services page
✅ Updated navigation and routing
✅ Improved admin panel workflows
✅ Added performance indexes
✅ Updated documentation

**Last Updated**: February 2, 2026