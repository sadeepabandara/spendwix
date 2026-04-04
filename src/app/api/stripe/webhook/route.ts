import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    // Handle successful subscription payment
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as any
      if (!invoice.subscription) {
        return NextResponse.json({ received: true })
      }

      const subscriptionId = typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription.id

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      const userId = subscription.metadata?.user_id

      if (userId) {
        // Update user's plan to 'pro' in database
        const supabase = createServerSupabaseClient()
        await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('id', userId)
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id

      if (userId) {
        // Optionally downgrade user back to 'free'
        const supabase = createServerSupabaseClient()
        await supabase
          .from('profiles')
          .update({ plan: 'free' })
          .eq('id', userId)
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
