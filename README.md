# Biz Millennium

A modern, full-featured event management and corporate website built with React, TypeScript, and Supabase.

## 🚀 Features

- **Event Management** - Create and manage conferences, roundtables, and in-house events
- **Blog System** - Full CMS with categories, SEO, and rich content
- **Career Portal** - Job listings with application forms
- **Gallery** - Image gallery with categories and events
- **Testimonials** - Customer testimonials showcase
- **Partners & Brands** - Partner and brand logo management
- **Dynamic Pages** - CMS-powered dynamic pages
- **Admin Dashboard** - Full admin panel for content management
- **Authentication** - Secure user authentication with role-based access

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🗄️ Database Setup

This project uses **Lovable Cloud** which provides an integrated Supabase backend. The database schema is automatically managed through migrations.

For detailed setup instructions, see [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md).

### Quick Start

The database includes:
- User authentication with profiles
- Role-based access control (admin, moderator, user)
- Content tables with Row-Level Security
- Automatic triggers for new user setup

### Making a User Admin

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid', 'admin');
```

## 📁 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and media
│   ├── components/
│   │   ├── admin/       # Admin panel components
│   │   ├── home/        # Homepage sections
│   │   ├── layout/      # Layout components
│   │   └── ui/          # shadcn/ui components
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # Supabase client & types
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   └── admin/       # Admin pages
│   └── test/            # Test files
├── supabase/
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
└── docs/                # Documentation
```

## 🔐 Authentication

The app uses Supabase Auth with:
- Email/password sign up and sign in
- Email verification (enabled by default)
- Role-based access control
- Protected admin routes

### User Roles

| Role | Access |
|------|--------|
| `user` | View public content |
| `moderator` | Edit content (coming soon) |
| `admin` | Full admin panel access |

## 🎨 Customization

### Theming

Edit the CSS variables in `src/index.css`:
```css
:root {
  --primary: 280 80% 55%;
  --secondary: 220 14% 96%;
  /* ... more variables */
}
```

### Components

All UI components use shadcn/ui and can be customized in `src/components/ui/`.

## 📝 Environment Variables

The following variables are automatically configured:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Lovable

Click **Share → Publish** in the Lovable editor.

### Vercel

The project includes a `vercel.json` for SPA routing:

```bash
vercel deploy
```

### Other Platforms

Build the project and deploy the `dist` folder:

```bash
npm run build
```

## 📄 API Reference

### Supabase Client

```typescript
import { supabase } from "@/integrations/supabase/client";

// Fetch data
const { data, error } = await supabase
  .from('events')
  .select('*')
  .order('event_date', { ascending: true });

// Insert data (requires auth)
const { data, error } = await supabase
  .from('blogs')
  .insert([{ title: 'New Post', slug: 'new-post' }]);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is proprietary software. All rights reserved.

## 🔗 Links

- **Live Site**: [bizmillennium.lovable.app](https://bizmillennium.lovable.app)
- **Documentation**: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
- **Lovable Docs**: [docs.lovable.dev](https://docs.lovable.dev)

---

Built with ❤️ using [Lovable](https://lovable.dev)
