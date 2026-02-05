# BoluLista

BoluLista is a minimal shopping list app built with Next.js (App Router), Prisma, and MongoDB. It supports categories, inline editing, and a simple email/password authentication flow with server-side sessions.

## Features

- Create, edit, and delete items.
- Organize items by categories.
- Simple authentication (email + password).
- Session-based access (items and categories are scoped per user).
- Healthcheck endpoint that validates the database connection.

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

## Healthcheck

The healthcheck endpoint verifies database connectivity:

```
GET /healthcheck
```

It returns:

```json
{ "status": "ok", "db": "connected" }
```

Or on failure:

```json
{ "status": "error", "db": "disconnected", "message": "..." }
```

## Notes for Deployment (Nixpacks)

If you deploy with Nixpacks, make sure `prisma generate` runs during build. A common approach is adding a `postinstall` script:

```json
"postinstall": "prisma generate"
```

Also ensure `DATABASE_URL` is available at build time so Prisma Client can be generated.
