# Biz Millennium Website

A modern, full-featured business conference and events platform built with React, TypeScript, and Supabase.

## 🚀 Features

### Core Functionality
- **Dynamic Event Management**: Upcoming and past events with automatic date-based categorization
- **Blog System**: Full-featured blog with categories, featured posts, and individual article pages
- **Event Gallery**: Photo galleries linked to specific events with lightbox viewing
- **Career Portal**: Job listings with custom application forms
- **Contact System**: Multi-form contact system for general inquiries and service-specific requests
- **Admin Dashboard**: Comprehensive CMS for managing all content

### Recent Updates (February 2026)
- ✅ **Favicon Updated**: New custom favicon reflecting Biz Millennium branding
- ✅ **Zoho Chatbot Integration**: Hovering chatbot widget across all pages
- ✅ **Events Sorting Fixed**: 
  - Upcoming events sorted in ascending order (earliest first)
  - Past events sorted in descending order (most recent first)
  - Applied to both homepage and events page
- ✅ **Blog Detail Pages**: Individual blog post pages with full content display
- ✅ **Navigation Improvements**: 
  - "Upcoming Events" button redirects to internal events page
  - Navbar tabs aligned more to the right for better visual balance
- ✅ **Logo Display Fixed**: Corrected logo import path in header component

### Design System
- **Typography**: Poppins font family with multiple weights
- **Color Scheme**: Purple-cyan gradient branding with black/white contrast
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Animations**: Smooth transitions, hover effects, and scroll animations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Build Tool**: Vite
- **Deployment**: Vercel (with Analytics and Speed Insights)

## 📦 Project Structure

```
bizmillennium/
├── src/
│   ├── components/
│   │   ├── home/           # Homepage sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── EventsSection.tsx
│   │   │   ├── BlogSection.tsx
│   │   │   └── ...
│   │   ├── layout/         # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/             # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx       # Homepage
│   │   ├── Events.tsx      # Events listing
│   │   ├── Blog.tsx        # Blog listing
│   │   ├── BlogDetail.tsx  # Individual blog post
│   │   ├── Contact.tsx     # Contact page
│   │   └── admin/          # Admin dashboard pages
│   ├── integrations/
│   │   └── supabase/       # Supabase client and types
│   ├── hooks/              # Custom React hooks
│   └── assets/             # Images and static files
├── supabase/
│   ├── migrations/         # Database migrations
│   ├── schema.sql          # Database schema documentation
│   └── seed.sql            # Sample data
└── public/
    ├── favicon.png         # Custom favicon
    └── logo.png            # Brand logo
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/eliteforumscontentcreation/bizmillennium.git
cd bizmillennium
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
pnpm run dev
```

5. Build for production:
```bash
pnpm run build
```

## 🗄️ Database Schema

The application uses Supabase with the following main tables:
- `events` - Event listings with dates, locations, and registration links
- `blogs` - Blog posts with categories and featured images
- `blog_categories` - Blog categorization
- `gallery` - Event photo galleries
- `careers` - Job postings
- `job_applications` - Career applications
- `testimonials` - Client testimonials
- `partners` - Partner organizations
- `brands` - Brand portfolio
- `contact_submissions` - Contact form submissions
- `site_settings` - Global site configuration

See `supabase/schema.sql` for complete schema documentation.

## 🔐 Admin Access

Access the admin dashboard at `/admin` with appropriate credentials. Features include:
- Event management (create, edit, delete)
- Blog post management with rich content editor
- Gallery management with event linking
- Career posting and application tracking
- Settings and configuration
- User role management

## 🎨 Customization

### Branding
- Update logo: Replace `/public/logo.png`
- Update favicon: Replace `/public/favicon.png`
- Modify colors: Edit Tailwind config in `tailwind.config.ts`
- Update fonts: Modify font imports in `src/index.css`

### Content
- Homepage sections: Edit components in `src/components/home/`
- Static pages: Edit files in `src/pages/`
- Navigation: Update `src/components/layout/Header.tsx`

## 📱 Third-Party Integrations

- **Zoho SalesIQ**: Live chat widget embedded in `index.html`
- **Vercel Analytics**: Performance and user analytics
- **Vercel Speed Insights**: Real-time performance monitoring

## 🐛 Known Issues

- CSS warning about `@import` order in build (non-blocking)
- Large bundle size warning (consider code splitting for optimization)

## 🚀 Deployment

The site is configured for Vercel deployment:
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📝 Recent Commits

- `180fa4a` - Fix logo import path in Header component
- `c95c290` - Update Upcoming Events button to redirect to /events page and adjust navbar alignment
- `e4799dc` - Update View All Events button to redirect to events page upcoming tab
- `261fd33` - Add BlogDetail page for individual blog posts and fix Events page sorting
- `64d6175` - Update favicon and embed Zoho chatbot

## 🤝 Contributing

This is a private project for Biz Millennium. For internal contributions:
1. Create a feature branch
2. Make your changes
3. Submit a pull request with detailed description

## 📄 License

Proprietary - All rights reserved by Biz Millennium

## 📞 Support

For technical support or questions, contact the development team or visit the admin dashboard.

---

**Last Updated**: February 11, 2026
**Version**: 1.2.0
**Maintained by**: Elite Forums Content Creation Team