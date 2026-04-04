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
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    // Handle successful subscription payment
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
      
      // Get the subscription to access metadata
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      )

      const userId = subscription.metadata?.user_id

      if (userId) {
        // Update user's plan to 'pro' in database
        const supabase = createServerSupabaseClient()
        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('id', userId)

        if (error) {
          console.error('Error updating user plan:', error)
        } else {
          console.log(`✅ User ${userId} upgraded to Pro`)
        }
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id

      if (userId) {
        // Optionally downgrade user back to 'free'
        const supabase = createServerSupabaseClient()
        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'free' })
          .eq('id', userId)

        if (error) {
          console.error('Error downgrading user plan:', error)
        } else {
          console.log(`ℹ️ User ${userId} downgraded to Free`)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
