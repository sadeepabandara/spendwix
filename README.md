# SpendWix — Budget Tracker

A modern, minimal personal finance tracker built with **Next.js 14**, **Supabase**, **Tailwind CSS**, and **Zustand**.

## Features

- **Auth** — Google, Apple, and email/password sign-in via Supabase Auth
- **Income** — Track multiple income sources with expected vs actual
- **Bills** — Recurring bills with due days and progress tracking
- **Expenses** — All expense categories with budget vs actual
- **Savings** — Savings goals with visual progress cards
- **Debt** — Monthly debt payment tracking
- **Transactions** — Log every purchase, auto-linked to budget categories
- **Daily view** — Day-by-day balance with bar chart
- **Multi-currency** — USD, AUD, LKR, GBP
- **Monetisation** — Free (5 entries/section) vs Pro (unlimited) with upgrade page
- **Month selector** — Switch between any of the last 12 months

---

## Quick Start

### 1. Clone and install

```bash
cd spendwise
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In your project dashboard, go to **SQL Editor**
3. Copy and run the entire contents of `supabase/schema.sql`
4. Go to **Authentication → Providers** and enable:
   - **Google** (needs Google Cloud OAuth credentials)
   - **Apple** (needs Apple Developer credentials)
   - **Email** is enabled by default

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Both values are in your Supabase project under **Settings → API**.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── page.tsx          # Sign in / sign up screen
│   │   └── callback/
│   │       └── route.ts      # OAuth callback handler
│   ├── dashboard/
│   │   ├── layout.tsx        # Sidebar + month selector
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── income/page.tsx
│   │   ├── bills/page.tsx
│   │   ├── expenses/page.tsx
│   │   ├── savings/page.tsx
│   │   ├── debt/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── daily/page.tsx
│   │   ├── upgrade/page.tsx  # Pricing / monetisation
│   │   └── settings/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Redirects to /auth or /dashboard
├── components/
│   ├── BudgetTable.tsx       # Reusable table for bills/expenses/savings/debt
│   ├── PageHeader.tsx
│   └── StatCard.tsx
├── hooks/
│   └── useMonthData.ts       # Loads all data for current month
├── lib/
│   ├── supabase.ts           # Supabase client (browser + server)
│   └── utils.ts              # Currency formatting, date helpers
├── store/
│   └── index.ts              # Zustand global state
└── types/
    └── index.ts              # TypeScript types
supabase/
└── schema.sql                # Full database schema + RLS policies
```

---

## Monetisation

The app has a built-in **Free vs Pro** model:

| Feature | Free | Pro |
|---|---|---|
| Entries per section/month | 5 | Unlimited |
| All tracking sections | ✓ | ✓ |
| Multi-currency | ✓ | ✓ |
| CSV export | — | ✓ |
| Priority support | — | ✓ |

**Pricing** (in `src/app/dashboard/upgrade/page.tsx`):
- USD: $4.99/mo or $47.99/yr
- AUD: $7.99/mo or $74.99/yr
- GBP: £3.99/mo or £37.99/yr
- LKR: Rs1,490/mo or Rs14,900/yr

To add real payment processing, integrate **Stripe** with a webhook that updates `profiles.plan` to `'pro'` on successful payment.

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Set the same environment variables in your Vercel project dashboard under **Settings → Environment Variables**.

Update your Supabase Auth settings:
- Go to **Authentication → URL Configuration**
- Add your Vercel URL to **Site URL** and **Redirect URLs**

---

## Adding OAuth Providers

### Google
1. Create credentials at [console.cloud.google.com](https://console.cloud.google.com)
2. Add `https://your-project.supabase.co/auth/v1/callback` as an authorised redirect URI
3. Paste Client ID and Secret into Supabase → Authentication → Providers → Google

### Apple
1. Create an App ID and Service ID at [developer.apple.com](https://developer.apple.com)
2. Follow the [Supabase Apple Auth guide](https://supabase.com/docs/guides/auth/social-login/auth-apple)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database + Auth | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |
| State | Zustand |
| Charts | Recharts |
| Language | TypeScript |
| Deployment | Vercel |
