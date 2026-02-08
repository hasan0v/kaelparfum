# 🌸 KƏEL PARFÜM - E-Commerce Platform

A modern, full-featured e-commerce platform for KƏEL PARFÜM - a premium perfume and cosmetics shop based in Azerbaijan. Built with Next.js 16, TypeScript, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.90-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog** - Browse products by categories and brands with advanced filtering
- 🔍 **Full-text Search** - Fast product search with PostgreSQL full-text search
- 🛒 **Shopping Cart** - Persistent cart with Zustand state management
- ❤️ **Wishlist** - Save favorite products for later
- 👤 **User Authentication** - Secure sign up/login with Supabase Auth
- 📦 **Order Management** - Place orders, track status, and view order history
- ⭐ **Product Reviews** - Rate and review products (verified purchase badges)
- 💬 **WhatsApp Integration** - Direct order communication via WhatsApp
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🌙 **Dark Mode** - Theme toggle with next-themes
- 🎨 **Modern UI** - Beautiful interface with Radix UI and Tailwind CSS

### Admin Features
- 📊 **Admin Dashboard** - Comprehensive admin panel for store management
- 📦 **Product Management** - CRUD operations for products with variants
- 🏷️ **Category Management** - Organize products with nested categories
- 🏢 **Brand Management** - Manage product brands
- 🚚 **Order Processing** - View, update, and manage customer orders
- 📝 **Review Moderation** - Approve/reject customer reviews
- 👥 **User Management** - View and manage registered users
- ⚙️ **Site Settings** - Configure delivery fees, WhatsApp number, and more
- 📸 **Image Upload** - Direct upload to Supabase Storage with drag-and-drop
- 🔐 **Role-Based Access** - Protected admin routes with middleware

### Technical Features
- ⚡ **Server Actions** - Modern data fetching with Next.js Server Actions
- 🔄 **React Query** - Efficient data caching and synchronization
- 🎯 **Type-Safe** - Full TypeScript support with generated Supabase types
- 🛡️ **Row Level Security** - Secure database access with Supabase RLS
- 📈 **SEO Optimized** - Meta tags, structured data, and dynamic sitemaps
- 🎬 **Animations** - Smooth animations with Framer Motion
- 📊 **Analytics Ready** - View count tracking and product analytics
- 🔔 **Toast Notifications** - User feedback with Sonner

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Carousels:** [Embla Carousel](https://www.embla-carousel.com/)
- **File Upload:** [React Dropzone](https://react-dropzone.js.org/)

### Backend
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Image Optimization:** [Sharp](https://sharp.pixelplumbing.com/)

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Code Quality:** TypeScript Strict Mode

## 📁 Project Structure

```
kaelparfum/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (public)/            # Public routes
│   │   │   ├── brendler/        # Brands listing & detail
│   │   │   ├── kateqoriyalar/   # Categories listing & detail
│   │   │   ├── mehsullar/       # Products listing & detail
│   │   │   ├── haqqimizda/      # About page
│   │   │   └── giris/           # Login page
│   │   ├── admin/               # Admin panel (protected)
│   │   │   ├── brendler/        # Brand management
│   │   │   ├── kateqoriyalar/   # Category management
│   │   │   ├── mehsullar/       # Product management
│   │   │   ├── sifarisler/      # Order management
│   │   │   ├── serhler/         # Review moderation
│   │   │   ├── istifadeciler/   # User management
│   │   │   └── parametrler/     # Site settings
│   │   ├── hesabim/             # User account pages
│   │   │   ├── sifarisler/      # Order history
│   │   │   └── sevimliler/      # Wishlist
│   │   ├── sebet/               # Shopping cart
│   │   ├── sifaris/             # Checkout
│   │   └── api/                 # API routes
│   ├── components/              # React components
│   │   ├── admin/               # Admin-specific components
│   │   ├── cart/                # Cart components
│   │   ├── layout/              # Layout components
│   │   ├── product/             # Product components
│   │   └── ui/                  # Reusable UI components (shadcn/ui)
│   ├── lib/                     # Utilities and libraries
│   │   ├── actions/             # Server Actions
│   │   ├── constants/           # Configuration constants
│   │   ├── hooks/               # Custom React hooks
│   │   ├── supabase/            # Supabase clients
│   │   └── utils/               # Utility functions
│   ├── types/                   # TypeScript type definitions
│   └── middleware.ts            # Next.js middleware (auth & admin protection)
├── supabase/                    # Database schema
│   ├── schema.sql               # Database schema
│   ├── seed.sql                 # Seed data
│   └── storage.sql              # Storage configuration
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **Supabase account** (free tier available at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kaelparfum.git
   cd kaelparfum
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials (see [Environment Variables](#-environment-variables))

4. **Set up the database**
   
   Run the SQL files in your Supabase SQL Editor in this order:
   ```bash
   1. supabase/schema.sql
   2. supabase/storage.sql
   3. supabase/seed.sql (optional)
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration (Optional - defaults in config.ts)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=994709717477
NEXT_PUBLIC_DELIVERY_FEE=5
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=50
```

### Getting Supabase Credentials

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy the **Project URL** and **anon/public key**

## 💾 Database Setup

### Schema Overview

The database includes the following main tables:

- **categories** - Product categories (hierarchical with parent_id)
- **brands** - Product brands
- **products** - Main products table with full-text search
- **product_images** - Product image gallery
- **product_variants** - Product variants (sizes, types, etc.)
- **profiles** - User profiles (extends auth.users)
- **addresses** - User shipping addresses
- **orders** - Customer orders
- **order_items** - Order line items
- **reviews** - Product reviews and ratings
- **wishlists** - User wishlists
- **site_settings** - Configurable site settings

### Key Features

- **Row Level Security (RLS)** - All tables have RLS policies
- **Full-text Search** - Products have a `search_vector` column
- **Auto-generated Order Numbers** - Format: `KP20260208001`
- **Triggers** - Auto-update `updated_at` timestamps
- **Functions** - Stock status, discount calculations, etc.

### Running Migrations

Execute the SQL files in your Supabase dashboard:

1. Open **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy contents from `supabase/schema.sql`
4. Click **Run**
5. Repeat for `storage.sql` and `seed.sql`

### Storage Buckets

The following storage buckets are needed:

- `products` - Product images
- `categories` - Category images
- `brands` - Brand logos

Configure these in the Supabase Storage section or run `storage.sql`.

## 📜 Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

3. **Add environment variables in Vercel**
   - Go to **Settings** → **Environment Variables**
   - Add all variables from `.env.local`

### Deploy to Other Platforms

This Next.js app can be deployed to:
- Vercel (recommended)
- Netlify
- Railway
- Render
- Any Node.js hosting platform

## 🧑‍💼 Admin Access

To create an admin user:

1. Sign up for an account through the website
2. Go to your Supabase dashboard
3. Navigate to **Authentication** → **Users**
4. Find your user in the list
5. Go to **Table Editor** → **profiles**
6. Find your profile row
7. Add a `role` column with value `'admin'` (or update the schema to include a role column)

**Note:** You may need to modify the `profiles` table to include a `role` column:

```sql
ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT 'user';
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Contact

**KƏEL PARFÜM**
- 📱 Phone: +994 070 971 74 77 / +994 051 572 73 78
- 📧 Email: info@kaelparfum.com
- 📍 Location: Qəbələ, Azerbaijan
- 📷 Instagram: [@kaelparfum](https://www.instagram.com/kaelparfum/)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - The Open Source Firebase Alternative
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Vercel](https://vercel.com/) - Deployment platform

---

Built with ❤️ for KƏEL PARFÜM
