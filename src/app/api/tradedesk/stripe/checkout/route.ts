export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS: Record<string, string> = {
  starter: 'price_1TLh2XJ1EcXUp9OLqTtZ0q9z',
  pro: 'price_1TLh2YJ1EcXUp9OLOznipWjn',
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nithdigital.uk'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { plan, email } = body

  if (!plan || !PRICE_IDS[plan]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email.trim().toLowerCase(),
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    subscription_data: {
      metadata: { plan },
    },
    metadata: { plan },
    success_url: `${BASE_URL}/tradedesk/signup/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/tradedesk/signup`,
    allow_promotion_codes: true,
    tax_id_collection: { enabled: true },
  })

  return NextResponse.json({ url: session.url })
}
