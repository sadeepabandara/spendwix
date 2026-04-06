# SpendWix

Personal budget tracker built with Next.js App Router, Supabase, Stripe, Tailwind CSS, Recharts, and Zustand.

## What It Does

- Email/password and social auth with Supabase (Google and Apple options in UI)
- Monthly income, bills, expenses, savings, debt, and transaction tracking
- Budget vs actual dashboards with charts and daily activity view
- Multi-currency experience (pricing and formatting adapt to currency)
- Free vs Pro plan model with per-section free limits and Stripe upgrade flow
- Stripe customer portal support for subscription management
- SEO baseline setup with metadata, robots, sitemap, and custom OG image

## Current Plan Model

- Free: up to 5 entries per section per month
- Pro: unlimited entries
- The Upgrade page also lists roadmap-style Pro perks (for example CSV export)
- Stripe webhook updates `profiles.plan` between `free` and `pro`

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Auth + Postgres + RLS)
- Stripe (subscriptions)
- Tailwind CSS
- Zustand
- Recharts
- Framer Motion

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project.
2. Open SQL Editor in Supabase.
3. Run everything in `supabase/schema.sql`.
4. Configure auth providers you want to use.

### 3. Create environment file

```bash
cp .env.local.example .env.local
```

Required values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID_MONTHLY=your_stripe_monthly_price_id
STRIPE_PRICE_ID_ANNUAL=your_stripe_annual_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Stripe Integration Notes

Implemented API routes:

- `POST /api/stripe/checkout`
- `POST /api/stripe/portal`
- `GET /api/stripe/subscription-status`
- `POST /api/stripe/webhook`

Recommended webhook events:

- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`

Webhook endpoint for local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## SEO and Social Preview

Configured in app metadata:

- Open Graph image: `public/og-image.png` (1200x630)
- Twitter card image: `public/og-image.png`
- `src/app/robots.ts` for crawl rules
- `src/app/sitemap.ts` for sitemap generation

Private areas are blocked from indexing:

- `/auth/*`
- `/dashboard/*`
- `/api/*`

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure (High Level)

```text
src/
    app/
        auth/
        dashboard/
        api/stripe/
        layout.tsx
        page.tsx
        robots.ts
        sitemap.ts
    components/
    hooks/
    lib/
    store/
    types/
supabase/
    schema.sql
```

## Deploying

Deploy on Vercel and set the same env vars in project settings.

Important for production URLs:

- Set `NEXT_PUBLIC_APP_URL` to your live domain (for example `https://spendwix.vercel.app`)
- Add your live auth callback URLs in Supabase Auth URL configuration
