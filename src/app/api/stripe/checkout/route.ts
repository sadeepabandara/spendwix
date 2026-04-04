import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// ─────────────────────────────────────────────────────────────────────────────
// Cashviro – Stripe Checkout API Route
// ─────────────────────────────────────────────────────────────────────────────
// Prerequisites (add these to .env.local):
//
//   STRIPE_SECRET_KEY=sk_live_...        ← from Stripe Dashboard → Developers → API Keys
//   STRIPE_PRICE_ID_MONTHLY=price_...   ← create a product "SpendWix Pro Monthly" in Stripe
//   STRIPE_PRICE_ID_ANNUAL=price_...    ← create a product "SpendWix Pro Annual" in Stripe
//   STRIPE_WEBHOOK_SECRET=whsec_...     ← for /api/stripe/webhook
//   NEXT_PUBLIC_APP_URL=https://your-domain.com
//
// Install Stripe: npm install stripe
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY
  const annualPriceId  = process.env.STRIPE_PRICE_ID_ANNUAL
  const appUrl         = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin

  if (!stripeSecretKey || !monthlyPriceId || !annualPriceId) {
    const missingVars = [
      !stripeSecretKey ? 'STRIPE_SECRET_KEY' : null,
      !monthlyPriceId ? 'STRIPE_PRICE_ID_MONTHLY' : null,
      !annualPriceId ? 'STRIPE_PRICE_ID_ANNUAL' : null,
    ].filter(Boolean)

    return NextResponse.json(
      {
        error: 'Stripe is not configured. Add STRIPE_SECRET_KEY, STRIPE_PRICE_ID_MONTHLY, and STRIPE_PRICE_ID_ANNUAL.',
        missing: missingVars,
      },
      { status: 500 }
    )
  }

  // Dynamically import Stripe so the build doesn't fail without the package
  let Stripe: any
  try {
    Stripe = (await import('stripe')).default
  } catch {
    return NextResponse.json(
      { error: 'Stripe package not installed. Run: npm install stripe' },
      { status: 500 }
    )
  }

  try {
    // Get current user from Supabase auth
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to upgrade' },
        { status: 401 }
      )
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' })
    const body = await req.json()
    const priceId = body.billing === 'annual' ? annualPriceId : monthlyPriceId

    if (!priceId) {
      return NextResponse.json(
        { error: 'No Stripe price configured for selected billing cycle.' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/upgrade?success=true`,
      cancel_url:  `${appUrl}/dashboard/upgrade?cancelled=true`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
      },
    })

    if (!session.url) {
      throw new Error('No checkout URL returned from Stripe')
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
