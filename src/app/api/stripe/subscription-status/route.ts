import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const ACTIVE_STATUSES = ['active', 'trialing', 'past_due', 'unpaid'] as const

export async function GET(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 })
  }

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
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' })
    const customers = await stripe.customers.list({ email: user.email, limit: 1 })
    const customer = customers.data[0]

    if (!customer) {
      return NextResponse.json({ status: 'none' })
    }

    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, limit: 10 })
    const subscription = subscriptions.data.find((sub: any) =>
      ACTIVE_STATUSES.includes(sub.status)
    )

    if (!subscription) {
      return NextResponse.json({ status: 'none' })
    }

    return NextResponse.json({
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch subscription status' },
      { status: 500 }
    )
  }
}
