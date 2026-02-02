# Biz Millennium - Enhancement Tasks

## Overview
This document tracks the implementation of new features for the Biz Millennium website.

## Tasks

### 1. Gallery Management Enhancement
**Status**: Pending
**Description**: Fix gallery management to allow creating events first, then adding photos to specific events
**Files to modify**:
- `src/pages/admin/GalleryAdmin.tsx` - Enhanced UI for event-based gallery management
- `src/pages/Gallery.tsx` - Already working correctly with event filtering

**Changes**:
- Add ability to create/select event before adding photos
- Improve UX for linking photos to events
- Add bulk upload capability for event photos

### 2. Events Management Enhancement
**Status**: Pending
**Description**: Add registration URL field to events and improve event detail page
**Files to modify**:
- `supabase/migrations/new_migration.sql` - Add registration_url column if not exists
- `src/pages/admin/EventsAdmin.tsx` - Add registration_url field to form
- `src/pages/Events.tsx` - Update to show registration button
- Create `src/pages/EventDetail.tsx` - New comprehensive event detail page

**Changes**:
- Add registration_url field to events table (already exists in schema)
- Update admin form to include registration URL
- Create detailed event page with registration CTA
- Remove external URL redirect, use internal event pages

### 3. Services Page Creation
**Status**: Pending
**Description**: Create dedicated Services page combining all service types
**Files to create**:
- `src/pages/Services.tsx` - New comprehensive services page with tabs

**Files to modify**:
- `src/App.tsx` - Add Services route
- `src/components/layout/Header.tsx` - Update "Explore Services" link
- `src/pages/About.tsx` - Update "Explore Services" button

**Changes**:
- Create tabbed Services page with: Conferences, Roundtable, In-house, Data Generation
- Update navigation to link to /services instead of /events
- Keep individual service pages for direct access

### 4. Supabase Schema Updates
**Status**: Pending
**Description**: Ensure database schema supports all features
**Files to create**:
- `supabase/migrations/20260202000000_enhance_events_gallery.sql` - New migration

**Changes**:
- Verify registration_url column exists in events table
- Add any missing indexes for performance
- Update RLS policies if needed

### 5. Documentation
**Status**: Pending
**Description**: Create comprehensive Supabase setup instructions
**Files to create**:
- `SUPABASE_INSTRUCTIONS_UPDATED.md` - Updated setup guide

**Changes**:
- Document new schema changes
- Provide migration instructions
- Include setup steps for new features

### 6. GitHub Push
**Status**: Pending
**Description**: Push all changes to GitHub repository
**Commands**:
- Configure git with access token
- Commit all changes
- Push to main branch

## Implementation Order
1. Supabase schema updates (migration file)
2. Gallery management enhancement
3. Events management enhancement
4. Event detail page creation
5. Services page creation
6. Navigation updates
7. Documentation
8. GitHub push