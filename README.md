# SpendWix

<p align="center">
  <img src="https://spendwix.vercel.app/og-image.png" alt="SpendWix Preview" width="100%" />
</p>

<p align="center">
  <strong>A modern personal finance tracker to manage budgets, track expenses, and gain clear financial insights.</strong>
</p>

<p align="center">
  Built with Next.js, Supabase, and Stripe.
</p>

---

## ✨ Why SpendWix?

Most budget apps are either too complex or too limited.

SpendWix focuses on:
- **Clarity** — clean dashboards with meaningful insights
- **Control** — track every aspect of your finances in one place
- **Scalability** — built like a real SaaS product with subscriptions

---

## 🚀 Features

- 🔐 Authentication (Email, Google, Apple)
- 💸 Track income, expenses, bills, savings, and debt
- 📊 Budget vs Actual dashboards with charts
- 🌍 Multi-currency support
- ⚡ Fast, responsive UI with smooth animations
- 💎 Free vs Pro subscription model
- 💳 Stripe checkout + billing portal
- 🔎 SEO optimized (metadata, sitemap, OG image)

---

## 💰 Pricing

| Plan | Features |
|------|--------|
| **Free** | Up to 5 entries per section per month |
| **Pro** | Unlimited entries + upcoming premium features |

> Subscription status is synced via Stripe webhooks.

---

## 🛠 Tech Stack

**Frontend & Backend**
- Next.js 14 (App Router)
- TypeScript

**Database & Auth**
- Supabase (PostgreSQL, Auth, RLS)

**Payments**
- Stripe (Subscriptions, Webhooks, Customer Portal)

**UI & State**
- Tailwind CSS
- Zustand
- Framer Motion

**Charts**
- Recharts

---

## 🧑‍💻 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup Supabase

- Create a project
- Open SQL Editor
- Run the SQL file located at:

```bash
supabase/schema.sql
```

- Enable auth providers (Google, Apple, etc.)

---

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PRICE_ID_MONTHLY=your_price_id
STRIPE_PRICE_ID_ANNUAL=your_price_id
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

Security note: never commit `.env.local` or any real secret keys to your repository.

---

### 4. Run locally

```bash
npm run dev
```

Open → http://localhost:3000

---

## 💳 Stripe Integration

**Endpoints**
- `/api/stripe/checkout`
- `/api/stripe/portal`
- `/api/stripe/subscription-status`
- `/api/stripe/webhook`

**Webhook Events**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`

**Local Testing**

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 🌐 SEO & Sharing

- Open Graph: `public/og-image.png`
- Twitter Card: same image
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`

**Blocked routes:**
- `/auth/*`
- `/dashboard/*`
- `/api/*`

---

## 📂 Project Structure

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

---

## 🚀 Deployment

Deploy on Vercel.

### Important

- Set production URL:

```env
NEXT_PUBLIC_APP_URL=https://spendwix.vercel.app
```

- Configure Supabase:
  - Add production domain
  - Add redirect URLs

---

## 🔮 Roadmap

- CSV export
- Advanced analytics
- Advanced mobile UX refinements
- Notifications & insights

---

## 📌 Live Demo

👉 https://spendwix.vercel.app

---

## ⭐ Support

If you like this project, consider giving it a star ⭐

---

## 📄 License

MIT License
