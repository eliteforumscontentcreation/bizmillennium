# Customizable Service Forms - Implementation Guide

## Overview
This feature allows administrators to customize form fields for each service type (Conferences, Roundtable, In-House, Data Generation) through the admin panel.

## Database Changes

### New Table: `service_form_fields`
Stores the configuration for each form field per service type.

**Columns:**
- `id` (UUID): Primary key
- `service_type` (TEXT): Service type (conferences, roundtable, in-house, data-generation)
- `field_name` (TEXT): Internal field name (lowercase, underscores)
- `field_label` (TEXT): Display label for the field
- `field_type` (TEXT): Input type (text, email, tel, textarea, number, url, date)
- `placeholder` (TEXT): Placeholder text
- `is_required` (BOOLEAN): Whether field is required
- `is_active` (BOOLEAN): Whether field is currently active
- `sort_order` (INTEGER): Display order of fields
- `validation_rules` (JSONB): Additional validation rules
- `created_at`, `updated_at` (TIMESTAMPTZ): Timestamps

### Updated Table: `service_contact_submissions`
Added `form_data` (JSONB) column to store all form field values dynamically.

## Migration File
Location: `/supabase/migrations/20260204000000_create_service_form_fields.sql`

**To apply the migration:**
1. Connect to your Supabase project
2. Run the migration SQL file through Supabase Studio or CLI
3. Verify tables are created successfully

## Admin Panel Usage

### Accessing Form Field Management
1. Log in to admin panel at `/admin`
2. Navigate to "Service Form Fields" in the sidebar
3. Select a service type from the dropdown

### Managing Form Fields

#### Adding a New Field
1. Click "Add Field" button
2. Fill in the form:
   - **Field Label**: Display name (e.g., "Your Name")
   - **Field Name**: Internal name (e.g., "full_name") - will be converted to lowercase with underscores
   - **Field Type**: Select input type (text, email, tel, textarea, number, url, date)
   - **Placeholder**: Optional placeholder text
   - **Required Field**: Toggle if field is mandatory
   - **Active**: Toggle if field should be displayed
3. Click "Create"

#### Editing a Field
1. Click the pencil icon next to the field
2. Modify the desired properties
3. Click "Update"

#### Deleting a Field
1. Click the trash icon next to the field
2. Confirm deletion

#### Reordering Fields
- Use the up/down arrow buttons to change field display order
- Changes are saved immediately

#### Activating/Deactivating Fields
- Toggle the switch in the "Active" column
- Inactive fields won't be displayed on the form but remain in the database

## Frontend Implementation

### ServiceContactForm Component
Location: `/src/components/ServiceContactForm.tsx`

The component now:
1. Fetches active form fields from `service_form_fields` table on mount
2. Dynamically renders fields based on configuration
3. Groups inline fields (text, email, tel, etc.) in a 2-column grid
4. Renders textarea fields full-width
5. Validates required fields before submission
6. Stores all form data in the `form_data` JSONB column

### Usage Example
```tsx
<ServiceContactForm 
  serviceType="conferences"
  title="Contact Us About Conferences"
  description="Fill out the form below..."
/>
```

## Default Form Fields
Each service type comes with default fields:
- Name (text, required)
- Email (email, required)
- Phone Number (tel, optional)
- Company (text, optional)
- Subject (text, optional)
- Message (textarea, required)

## Security & Permissions

### Row Level Security (RLS)
- **Public users**: Can view active form fields and submit forms
- **Authenticated users**: Can view all fields and manage field configurations
- **Admin users**: Full access to all operations

## API Integration

### Fetching Form Fields
```typescript
const { data, error } = await supabase
  .from("service_form_fields")
  .select("*")
  .eq("service_type", "conferences")
  .eq("is_active", true)
  .order("sort_order", { ascending: true });
```

### Submitting Form Data
```typescript
const { error } = await supabase
  .from("service_contact_submissions")
  .insert([{
    service_type: "conferences",
    name: formData.name,
    email: formData.email,
    phone: formData.phone || null,
    company: formData.company || null,
    subject: formData.subject || null,
    message: formData.message,
    form_data: formData, // All fields stored here
  }]);
```

## Viewing Submissions

### Admin Panel
Navigate to "Service Contact Submissions" to view all form submissions. The `form_data` column contains all custom field values.

## Troubleshooting

### Forms Not Loading
- Check Supabase connection
- Verify migration has been applied
- Check browser console for errors

### Fields Not Appearing
- Ensure fields are marked as "Active"
- Check `is_active` column in database
- Verify service type matches

### Submission Errors
- Check required fields are filled
- Verify Supabase RLS policies
- Check network tab for API errors

## Future Enhancements
Potential improvements:
- Field validation rules (min/max length, regex patterns)
- Conditional field visibility
- File upload fields
- Multi-select dropdowns
- Date range pickers
- Rich text editor for message fields

## Support
For issues or questions, contact the development team or refer to the Supabase documentation.