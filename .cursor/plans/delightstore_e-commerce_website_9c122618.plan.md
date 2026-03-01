---
name: DelightStore E-commerce Website
overview: Build a full-featured e-commerce website using Next.js 14 with TypeScript, PostgreSQL database, and all essential features including product catalog, shopping cart, checkout, user authentication, payment integration, admin panel, and search/filter functionality.
todos: []
---

# DelightStore E-commerce Website - Implementation Plan

## Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with Prisma ORM
- **Database**: PostgreSQL (using Supabase or local PostgreSQL)
- **Authentication**: NextAuth.js
- **Payment**: Selcom API Gateway integration
- **State Management**: Zustand for cart and UI state
- **Image Optimization**: Next.js Image component

## Project Structure

```
delight_store/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth routes (login, register)
│   ├── (shop)/                  # Shop routes (products, cart, checkout)
│   ├── admin/                   # Admin panel (protected)
│   ├── api/                     # API routes
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── products/                # Product-related components
│   ├── cart/                    # Cart components
│   └── admin/                   # Admin components
├── lib/                         # Utilities and configurations
│   ├── db.ts                    # Prisma client
│   ├── auth.ts                  # NextAuth config
│   └── selcom.ts                # Selcom API Gateway config
├── prisma/                      # Prisma schema and migrations
│   └── schema.prisma            # Database schema
├── public/                      # Static assets
│   ├── logo/                    # Logo files (existing)
│   └── products/                # Product images (existing)
└── types/                       # TypeScript type definitions
```

## Database Schema

The database will include:

- **Users**: id, email, name, password (hashed), role (customer/admin)
- **Products**: id, name, description, price, category, stock, images, createdAt, updatedAt
- **Categories**: id, name, slug
- **CartItems**: id, userId, productId, quantity
- **Orders**: id, userId, total, status, createdAt
- **OrderItems**: id, orderId, productId, quantity, price
- **Payments**: id, orderId, selcomOrderId, selcomTransactionId, amount, status, paymentMethod

## Key Features Implementation

### 1. Product Catalog

- Display products by category (Smart Watches, Gadgets, Speakers, Mobile Accessories)
- Grid/list view toggle
- Product cards with image, name, price, "Add to Cart" button
- Responsive design with Tailwind CSS

### 2. Product Detail Pages

- Full product information
- Image gallery
- Quantity selector
- Add to cart functionality
- Related products section

### 3. Shopping Cart

- Persistent cart (database + session)
- Quantity updates
- Remove items
- Cart total calculation
- Mini cart dropdown

### 4. Checkout Process

- Multi-step checkout (cart review → shipping → payment)
- Form validation
- Order creation
- Selcom API Gateway payment integration
  - Support for Masterpass, debit/credit cards (Mastercard, VISA, Amex)
  - Mobile money payment support
  - Payment redirect and callback handling
- Order confirmation page

### 5. User Authentication

- Register/Login pages
- Protected routes
- Session management with NextAuth.js
- Password hashing with bcrypt

### 6. Admin Panel

- Dashboard with sales overview
- Product management (CRUD operations)
- Order management
- Category management
- Image upload functionality

### 7. Search and Filter

- Search bar in header
- Filter by category
- Filter by price range
- Sort by price, name, date

### 8. Additional Features

- Responsive navigation with logo
- Footer with company information
- Loading states and error handling
- Toast notifications for user actions
- SEO optimization with metadata

## Implementation Steps

1. **Project Setup**

   - Initialize Next.js 14 project with TypeScript
   - Install dependencies (Prisma, NextAuth, selcom-apigw-client, Tailwind CSS, Zustand)
   - Configure environment variables (Selcom API credentials: vendor ID, API key, secret key)

2. **Database Setup**

   - Set up PostgreSQL database (local or Supabase)
   - Create Prisma schema
   - Run migrations
   - Seed initial data (categories, sample products)

3. **Core UI Components**

   - Layout components (Header, Footer, Navigation)
   - Product card component
   - Button, Input, Modal components
   - Loading and error components

4. **Authentication System**

   - Configure NextAuth.js
   - Create login/register pages
   - Implement protected routes middleware

5. **Product Features**

   - Product catalog page with categories
   - Product detail pages
   - Category filtering and search

6. **Shopping Cart**

   - Cart state management (Zustand)
   - Cart API endpoints
   - Cart UI components
   - Persistent cart functionality

7. **Checkout & Payments**

   - Checkout flow pages
   - Order creation API
   - Selcom API Gateway integration
     - Configure Selcom API client with authentication (HMAC SHA256 signatures)
     - Implement payment initiation endpoint
     - Handle payment redirect to Selcom checkout
     - Set up webhook endpoint for payment status callbacks
     - Implement payment status verification
   - Order confirmation page with payment status

8. **Admin Panel**

   - Admin dashboard
   - Product management interface
   - Order management
   - Image upload handling

9. **Polish & Optimization**

   - Responsive design refinement
   - Image optimization
   - SEO metadata
   - Error handling
   - Performance optimization

## Product Data Structure

Since you have product data, we'll create a structure to import your products. Each product will need:

- Name
- Description
- Price
- Category (Smart Watches, Gadgets, Speakers, Mobile Accessories)
- Stock quantity
- Image paths (matching existing product images)

## Notes

- All 47 product images will be utilized and mapped to products
- Logo files will be integrated into the header and footer
- The site will be fully responsive for mobile, tablet, and desktop
- Payment integration will use Selcom API Gateway
  - Supports Masterpass, debit/credit cards (Mastercard, VISA, Amex), and mobile money
  - Requires Selcom API credentials (vendor ID, API key, secret key)
  - Will implement test mode initially using Selcom test credentials
  - Webhook callback endpoint for real-time payment status updates