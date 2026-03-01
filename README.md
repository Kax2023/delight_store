# DelightStore E-commerce Website

A full-featured e-commerce platform built with Next.js 14, TypeScript, PostgreSQL, and Clickpesa payment gateway.

## Features

- 🛍️ **Product Catalog** - Browse products by category with search and filtering
- 🛒 **Shopping Cart** - Persistent cart with Zustand state management
- 💳 **Payment Integration** - Clickpesa API Gateway for payments (cards, mobile money, Masterpass)
- 🔐 **Authentication** - User registration and login with NextAuth.js
- 👤 **User Dashboard** - View order history and manage account
- 🔧 **Admin Panel** - Manage products, orders, and view analytics
- 📱 **Responsive Design** - Fully responsive for mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment**: Clickpesa API Gateway
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom components with Tailwind

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or Supabase)
- Clickpesa API credentials (vendor ID, API key, secret key)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd delight_store
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/delightstore?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Selcom API Gateway
SELCOM_VENDOR_ID="your-vendor-id"
SELCOM_API_KEY="your-api-key"
SELCOM_SECRET_KEY="your-secret-key"
SELCOM_BASE_URL="https://api.selcommobile.com/v1"

# Node Environment
NODE_ENV="development"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Admin Credentials

After running the seed script:
- Email: `admin@delightstore.tz.com`
- Password: `admin123`

**Note**: Change the admin password immediately in production!

## Project Structure

```
delight_store/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (shop)/            # Shop routes
│   ├── admin/             # Admin panel (protected)
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── products/         # Product-related components
│   ├── cart/             # Cart components
│   └── admin/            # Admin components
├── lib/                  # Utilities and configurations
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # NextAuth config
│   └── selcom.ts         # Selcom API Gateway config
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
├── public/               # Static assets
│   ├── logo/             # Logo files
│   └── products/         # Product images
└── store/                # Zustand stores
    └── cart-store.ts     # Cart state management
```

## Categories

The store includes four main categories:
- Smart Watches
- Gadgets
- Speakers
- Mobile Accessories

## Payment Integration

The platform uses Selcom API Gateway for payment processing, supporting:
- Debit/Credit Cards (Mastercard, VISA, Amex)
- Masterpass
- Mobile Money

Payment flow:
1. User completes checkout form
2. Order is created in database
3. Payment is initiated with Selcom
4. User is redirected to Selcom checkout
5. Payment status is verified via webhook callback
6. Order status is updated accordingly

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

For deployment to platforms like Vercel, make sure to:
- Set all environment variables in the platform's dashboard
- Configure the database connection
- Set up webhook URLs for Selcom payment callbacks

## License

This project is private and proprietary.
