# BoluLista

BoluLista is a personal shopping wishlist app built with Next.js (App Router), Prisma, and MongoDB. Keep track of products you want to buy with links, images, descriptions, and custom categories.

## Features

- **Shopping Items Management**: Create, edit, and delete shopping items with name, description, product link, and image URL.
- **Product Links & Images**: Each item can include a direct link to the product and an image preview.
- **Custom Categories**: Organize items by categories and create new categories on the fly.
- **User Authentication**: Simple email/password authentication with secure server-side sessions.
- **User Privacy**: All items and categories are scoped per user—your lists are private.
- **Database Healthcheck**: Built-in endpoint to monitor database connectivity.

## Tech Stack

- Next.js 16 (App Router)
- Prisma 6 + MongoDB
- Tailwind CSS v4
- Zod validation

## Requirements

- Node.js 20+
- MongoDB connection string

## Environment Variables

Create a `.env` file with:

```bash
DATABASE_URL="mongodb://..."
SESSION_SECRET="your-strong-secret"
```

Optional (only if using Prisma Accelerate):

```bash
ACCELERATE_URL="your-accelerate-url"
```

## Getting Started

Install dependencies:

```bash
npm install
```

Generate Prisma Client (required for local dev builds):

```bash
npx prisma generate
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── actions/
│   ├── auth.ts          # Authentication server actions (register, login, logout)
│   └── items.ts         # Item & category CRUD operations
├── healthcheck/
│   └── route.ts         # Database health monitoring endpoint
├── layout.tsx           # Root layout with metadata
└── page.tsx             # Main page (authentication + shopping list)

components/
├── auth-form.tsx        # Login/Register form
├── add-item-form.tsx    # Form to create items and categories
└── item-list.tsx        # Display and inline editing of items

lib/
├── prisma.ts            # Prisma client singleton
├── session.ts           # Session management (HMAC-signed cookies)
└── password.ts          # Password hashing utilities

prisma/
└── schema.prisma        # Database schema (User, Item, Category)
```

## Healthcheck

The healthcheck endpoint verifies database connectivity:

```
GET /healthcheck
```

On success (200):

```json
{ "status": "ok" }
```

On failure (503):

```json
{
  "status": "error",
  "db": "disconnected",
  "message": "..."
}
```

## Security

BoluLista implements several security best practices:

- **Password Security**: Passwords are hashed using scrypt (Node.js crypto) with random salts before storage.
- **Session Security**: Sessions use HMAC-signed cookies with secure, httpOnly, and sameSite flags.
- **Authorization**: All database queries filter by the authenticated user's ID to prevent unauthorized access.
- **Input Validation**: All user inputs are validated with Zod schemas before processing.
- **Session Expiry**: Sessions automatically expire after 7 days.

## Notes for Deployment (Nixpacks)

If you deploy with Nixpacks, make sure `prisma generate` runs during build. A common approach is adding a `postinstall` script:

```json
"postinstall": "prisma generate"
```

Also ensure `DATABASE_URL` is available at build time so Prisma Client can be generated.
