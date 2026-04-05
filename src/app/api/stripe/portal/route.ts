import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin

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
      return NextResponse.json(
        { error: 'No Stripe customer found for this account.' },
        { status: 404 }
      )
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${appUrl}/dashboard/upgrade`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to open billing portal' },
      { status: 500 }
    )
  }
}
