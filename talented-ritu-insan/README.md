# Talented Ritu Insan - Fashion Design Institute Website

A complete React + TypeScript + Vite clone with Supabase authentication, Admin panel, and CRM system.

## Features

### Public Pages
- Home page with hero, courses showcase, and footer
- Courses listing and detail pages
- Workshops listing and detail pages
- Referral program page
- Our Superstars (success stories) page
- Language toggle (English/Hindi)

### Admin Panel (`/admin/*`)
- Dashboard with statistics
- Courses management (CRUD)
- Workshops management (CRUD)
- Leads management with status tracking
- Referrals management
- Team management
- Analytics dashboard

### CRM Panel (`/crm-private/*`)
- Dashboard with personal stats
- My Leads management
- Lead detail panel with notes
- Analytics
- Leaderboard

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Go to Authentication > Providers and enable Email provider
4. Create your first admin user in Authentication > Users

### 3. Configure Environment

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Create Admin User

1. In Supabase Auth, create a user with email/password
2. Run this SQL to add them as admin:

```sql
INSERT INTO employees (id, name, email, role)
VALUES (
  'user-uuid-from-auth',
  'Admin Name',
  'admin@example.com',
  'admin'
);
```

### 5. Run Development Server

```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Hero.tsx
│   ├── Courses.tsx
│   ├── Footer.tsx
│   ├── LanguageToggle.tsx
│   └── ProtectedRoute.tsx
├── context/             # React contexts
│   ├── AppContext.tsx
│   └── AuthContext.tsx
├── hooks/               # Custom hooks
│   └── useLanguage.ts
├── layouts/             # Layout components
│   ├── AdminLayout.tsx
│   └── CRMLayout.tsx
├── lib/                 # Utilities and config
│   ├── supabase.ts
│   └── translations.ts
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   ├── crm/             # CRM pages
│   ├── HomePage.tsx
│   ├── CoursesPage.tsx
│   └── ...
└── App.tsx              # Main app with routing
```

## Available Routes

### Public
- `/` - Home
- `/courses` - Courses listing
- `/course/:slug` - Course detail
- `/workshops` - Workshops listing
- `/workshop/:slug` - Workshop detail
- `/referral` - Referral program
- `/our-superstars` - Success stories

### Authentication
- `/loginprivate` - Admin login
- `/crm-login` - CRM login

### Admin (requires admin role)
- `/admin/dashboard`
- `/admin/courses`
- `/admin/workshops`
- `/admin/leads`
- `/admin/offline-leads`
- `/admin/landing-page-leads`
- `/admin/referrals`
- `/admin/centres`
- `/admin/analytics`
- `/admin/webhooks`
- `/admin/landing-pages`
- `/admin/team-management`

### CRM (requires calls/manager/admin role)
- `/crm-private/dashboard`
- `/crm-private/my-leads`
- `/crm-private/external-leads`
- `/crm-private/team-workload`
- `/crm-private/analytics`
- `/crm-private/leaderboard`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

Private - All rights reserved.
