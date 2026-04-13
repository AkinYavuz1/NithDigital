export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
function getResend() { return new Resend(process.env.RESEND_API_KEY!) }

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nithdigital.uk'
const WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || '+447404173024'

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  let code = 'TD-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

async function createAccessCode(notes: string | null): Promise<string> {
  for (let attempts = 0; attempts < 5; attempts++) {
    const code = generateCode()
    const { error } = await sb
      .from('tradedesk_access_codes')
      .insert({ code, notes })
    if (!error) return code
    if (error.code !== '23505') throw new Error(error.message)
  }
  throw new Error('Failed to generate unique access code')
}

async function sendWelcomeEmail(email: string, code: string, plan: string) {
  const planLabel = plan === 'pro' ? 'Pro' : 'Starter'
  const planColour = plan === 'pro' ? '#D4A84B' : '#1B2A4A'

  await getResend().emails.send({
    from: 'TradeDesk <hello@mail.nithdigital.uk>',
    to: email,
    subject: `Your TradeDesk access code — ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1B2A4A;">
        <div style="background: #1B2A4A; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #D4A84B; font-size: 20px; margin: 0;">TradeDesk</h1>
          <p style="color: rgba(245,240,230,0.6); font-size: 13px; margin: 4px 0 0;">by Nith Digital</p>
        </div>
        <div style="background: #fff; padding: 28px 32px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="margin: 0 0 16px;">Thanks for signing up to TradeDesk <span style="background: ${planColour}; color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 100px; font-weight: 600;">${planLabel}</span></p>
          <p style="margin: 0 0 24px;">To get started, save our WhatsApp number and send it your access code:</p>

          <div style="background: #f9f8f5; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; text-align: center;">
            <p style="font-size: 12px; color: #5A6A7A; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your access code</p>
            <p style="font-family: monospace; font-size: 28px; font-weight: 700; color: #1B2A4A; letter-spacing: 4px; margin: 0;">${code}</p>
          </div>

          <div style="background: #f0f4ff; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
            <p style="font-size: 13px; font-weight: 700; color: #1B2A4A; margin: 0 0 8px;">How to activate:</p>
            <ol style="font-size: 13px; color: #5A6A7A; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Save <strong>${WHATSAPP_NUMBER}</strong> in your phone as <strong>TradeDesk</strong></li>
              <li>Open WhatsApp and send your code: <strong>${code}</strong></li>
              <li>Follow the setup prompts — takes 30 seconds</li>
            </ol>
          </div>

          <p style="font-size: 13px; color: #5A6A7A; margin: 0 0 16px;">Once activated you can:</p>
          <ul style="font-size: 13px; color: #5A6A7A; margin: 0 0 24px; padding-left: 20px; line-height: 1.8;">
            <li>Ask any trade question and get an instant answer</li>
            <li>Send invoice photos — I'll log them automatically</li>
            <li>Send job photos — I'll add captions and post to Google</li>
            ${plan === 'pro' ? '<li>Get a public gallery website built from your portfolio</li>' : ''}
          </ul>

          <a href="${BASE_URL}/api/tradedesk/stripe/portal" style="display: inline-block; background: #1B2A4A; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">Manage subscription</a>
        </div>
        <div style="background: #f9f8f5; padding: 16px 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 11px; color: #5A6A7A; margin: 0;">TradeDesk by Nith Digital · <a href="${BASE_URL}/tradedesk" style="color: #D4A84B;">nithdigital.uk/tradedesk</a></p>
        </div>
      </div>
    `,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('[Stripe webhook] signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break

        const email = session.customer_email || session.customer_details?.email
        const customerId = session.customer as string
        const plan = (session.metadata?.plan || 'starter') as string

        if (!email) {
          console.error('[Stripe webhook] No email on checkout session', session.id)
          break
        }

        // Generate access code
        const code = await createAccessCode(`Stripe checkout — ${email} (${plan})`)

        // Send welcome email with code
        await sendWelcomeEmail(email, code, plan)

        // If a tradedesk_user already exists with this email, link them
        await sb
          .from('tradedesk_users')
          .update({
            stripe_customer_id: customerId,
            stripe_status: 'active',
            stripe_plan: plan,
          })
          .eq('email', email)

        console.log(`[Stripe webhook] checkout complete — ${email} (${plan}) code: ${code}`)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        const status = sub.status
        const plan = (sub.metadata?.plan || 'starter') as string

        await sb
          .from('tradedesk_users')
          .update({ stripe_status: status, stripe_plan: plan })
          .eq('stripe_customer_id', customerId)

        console.log(`[Stripe webhook] subscription updated — ${customerId} status: ${status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        await sb
          .from('tradedesk_users')
          .update({ stripe_status: 'cancelled', active: false })
          .eq('stripe_customer_id', customerId)

        console.log(`[Stripe webhook] subscription cancelled — ${customerId}`)
        break
      }
    }
  } catch (err) {
    console.error('[Stripe webhook] handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
