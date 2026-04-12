export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'
import Anthropic from '@anthropic-ai/sdk'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const WHATSAPP_FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`

// ── Helpers ─────────────────────────────────────────────────────────────────

async function sendWhatsApp(to: string, body: string) {
  await twilioClient.messages.create({
    from: WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
  })
}

async function logMessage(
  userId: string,
  direction: 'in' | 'out',
  body: string | null,
  mediaUrl: string | null,
  flow: string | null
) {
  await sb.from('tradedesk_messages').insert({
    user_id: userId,
    direction,
    message_body: body,
    media_url: mediaUrl,
    flow,
  })
}

async function downloadTwilioMedia(mediaUrl: string): Promise<{ buffer: Buffer; contentType: string }> {
  const auth = Buffer.from(
    `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
  ).toString('base64')

  const res = await fetch(mediaUrl, {
    headers: { Authorization: `Basic ${auth}` },
  })

  if (!res.ok) throw new Error(`Failed to download media: ${res.status}`)

  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const buffer = Buffer.from(await res.arrayBuffer())
  return { buffer, contentType }
}

async function uploadToStorage(
  buffer: Buffer,
  contentType: string,
  path: string
): Promise<string> {
  const { error } = await sb.storage.from('tradedesk').upload(path, buffer, {
    contentType,
    upsert: false,
  })
  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data } = sb.storage.from('tradedesk').getPublicUrl(path)
  return data.publicUrl
}

function getExt(contentType: string): string {
  if (contentType.includes('png')) return 'png'
  if (contentType.includes('webp')) return 'webp'
  if (contentType.includes('gif')) return 'gif'
  return 'jpg'
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 8)
}

// ── Flow: Groq Q&A ────────────────────────────────────────────────────────

async function handleQA(userId: string, phone: string, question: string) {
  let reply = 'Sorry, I could not generate a response right now. Please try again.'

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: `You are TradeDesk, a no-nonsense trade assistant built for Scottish tradespeople — plumbers, electricians, builders, joiners, plasterers, roofers, landscapers, gas engineers, painters, and all other trades.

You know Scotland inside out: Scottish Building Standards (not English Building Regs), SNIPEF for plumbing, SELECT for electricians, local pricing in Dumfries & Galloway, the Borders, Ayrshire, and the Central Belt. You know that D&G is rural and remote — travel time, fuel, and access matter more here than in cities.

How to answer:
- Be direct and practical. No waffle, no corporate speak.
- Give actual numbers when asked about pricing — ranges are fine but be specific (e.g. "£180–£250/day labour for a plumber in D&G, materials on top").
- Always mention VAT if relevant (VAT threshold £90k turnover, 20% standard rate, flat rate scheme option).
- Mention CIS (Construction Industry Scheme) when subcontractors or larger jobs come up.
- For materials, think Scottish suppliers: Jewson, Travis Perkins, Graham, BSS, TF Solutions, local builders merchants.
- For regulations: Scottish Building Standards (BSD), Gas Safe, NICEIC/NAPIT, SNIPEF, SELECT, CHAS.
- If someone asks about pricing, factor in: labour, materials, plant hire, travel (especially rural D&G), waste disposal, and margin (20–30% is normal).
- Keep answers under 200 words unless the question genuinely needs more.
- No bullet points with headers — just plain conversational text with line breaks if needed.
- Never say "it depends" without immediately saying what it depends on and giving numbers for each scenario.`,
          },
          { role: 'user', content: question },
        ],
      }),
    })

    const data = await res.json()
    reply = data.choices?.[0]?.message?.content || reply
  } catch {
    // fall through to default reply
  }

  await sendWhatsApp(phone, reply)
  await logMessage(userId, 'out', reply, null, 'qa')
}

// ── Flow: Portfolio photo ─────────────────────────────────────────────────

async function handlePortfolio(
  userId: string,
  phone: string,
  mediaUrl: string,
  rawCaption: string | null
) {
  const { buffer, contentType } = await downloadTwilioMedia(mediaUrl)
  const ext = getExt(contentType)
  const path = `${userId}/portfolio/${Date.now()}-${shortId()}.${ext}`
  const imageUrl = await uploadToStorage(buffer, contentType, path)

  let aiCaption = 'Professional job completed.'
  let socialPost = `Great job done today! ${rawCaption || ''} #TradeLife #UKTrades`

  try {
    const base64 = buffer.toString('base64')
    const mediaType = contentType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: `This is a photo of a completed trade job${rawCaption ? `. The tradesperson added: "${rawCaption}"` : ''}.

Generate:
1. A portfolio caption (1-2 sentences, professional, describes the work visible in the photo)
2. A social media post (2-3 sentences for Facebook/Instagram, include 3-5 relevant hashtags, can use emojis)

Respond in this exact JSON format:
{"caption": "...", "social_post": "..."}`,
            },
          ],
        },
      ],
    })

    const text = (msg.content[0] as any).text.trim()
    const parsed = JSON.parse(text)
    aiCaption = parsed.caption || aiCaption
    socialPost = parsed.social_post || socialPost
  } catch {
    // fall through to defaults
  }

  await sb.from('tradedesk_portfolio_posts').insert({
    user_id: userId,
    image_url: imageUrl,
    ai_caption: aiCaption,
    raw_caption: rawCaption,
    social_post_text: socialPost,
    published: true,
  })

  const reply = `✅ Added to your portfolio!\n\n*Caption:*\n${aiCaption}\n\n*Ready to share:*\n${socialPost}`
  await sendWhatsApp(phone, reply)
  await logMessage(userId, 'out', reply, null, 'portfolio')
}

// ── Flow: Expense extraction ──────────────────────────────────────────────

async function handleExpense(
  userId: string,
  phone: string,
  mediaUrl: string,
  messageBody: string
) {
  const { buffer, contentType } = await downloadTwilioMedia(mediaUrl)
  const ext = getExt(contentType)
  const path = `${userId}/expenses/${Date.now()}-${shortId()}.${ext}`
  const imageUrl = await uploadToStorage(buffer, contentType, path)

  let supplier = 'Unknown'
  let date: string | null = null
  let amount: number | null = null
  let vat: number | null = null
  let category = 'Other'
  let rawText = ''

  try {
    const base64 = buffer.toString('base64')
    const mediaType = contentType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: `This is an invoice or receipt from a UK tradesperson.

Extract the following and respond in this exact JSON format:
{
  "supplier": "company name or person who issued this",
  "date": "YYYY-MM-DD or null if not found",
  "amount": numeric total amount in GBP (excluding VAT) or null,
  "vat": numeric VAT amount in GBP or null,
  "category": one of: Materials, Tools, Fuel, Insurance, Subcontractor, Office, Vehicle, Other
}

Only return the JSON, nothing else.`,
            },
          ],
        },
      ],
    })

    rawText = (msg.content[0] as any).text.trim()
    const parsed = JSON.parse(rawText)
    supplier = parsed.supplier || supplier
    date = parsed.date || null
    amount = typeof parsed.amount === 'number' ? parsed.amount : null
    vat = typeof parsed.vat === 'number' ? parsed.vat : null
    category = parsed.category || category
  } catch {
    // fall through to defaults
  }

  await sb.from('tradedesk_expenses').insert({
    user_id: userId,
    image_url: imageUrl,
    supplier,
    date,
    amount,
    vat,
    category,
    raw_text: rawText,
  })

  const amountStr = amount !== null ? `£${amount.toFixed(2)}` : '(amount not found)'
  const vatStr = vat !== null ? ` + £${vat.toFixed(2)} VAT` : ''
  const dateStr = date || 'date not found'

  const reply = `✅ Expense logged!\n\n*${supplier}*\n${amountStr}${vatStr}\n${dateStr}\nCategory: ${category}`
  await sendWhatsApp(phone, reply)
  await logMessage(userId, 'out', reply, null, 'expense')
}

// ── Main handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Twilio sends form-encoded data
  const rawBody = await req.text()
  const params = new URLSearchParams(rawBody)
  const paramObj = Object.fromEntries(params.entries())

  // Validate Twilio signature
  const signature = req.headers.get('X-Twilio-Signature') || ''
  const webhookUrl = `https://nithdigital.uk/api/tradedesk/webhook`
  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    signature,
    webhookUrl,
    paramObj
  )

  // Log validation result for debugging — remove after confirmed working
  console.log('[TradeDesk] signature valid:', isValid, '| from:', params.get('From'))

  if (!isValid && process.env.NODE_ENV === 'production') {
    // Temporarily log and pass through to diagnose — re-enable strict block after testing
    console.warn('[TradeDesk] signature mismatch — proceeding anyway for debug')
  }

  const rawFrom = params.get('From') || ''
  const body = (params.get('Body') || '').trim()
  const numMedia = parseInt(params.get('NumMedia') || '0', 10)
  const mediaUrl = params.get('MediaUrl0') || null
  const mediaContentType = params.get('MediaContentType0') || 'image/jpeg'

  // Strip "whatsapp:" prefix
  const phone = rawFrom.replace(/^whatsapp:/, '')

  // Lookup or create user
  let { data: user } = await sb
    .from('tradedesk_users')
    .select('id')
    .eq('phone_number', phone)
    .single()

  if (!user) {
    const { data: newUser } = await sb
      .from('tradedesk_users')
      .insert({ phone_number: phone })
      .select('id')
      .single()
    user = newUser

    // Welcome message
    const welcome =
      'Welcome to *TradeDesk* by Nith Digital! 👋\n\nSend me:\n• A *question* — I\'ll answer it\n• A *job photo* — I\'ll write a portfolio caption and social post\n• An *invoice or receipt photo* (say "invoice" or "receipt") — I\'ll log the expense\n\nType anything to get started.'
    await sendWhatsApp(phone, welcome)
    await logMessage(user!.id, 'out', welcome, null, null)
  }

  const userId = user!.id

  // Log inbound message
  await logMessage(userId, 'in', body || null, mediaUrl, null)

  // Route
  try {
    const bodyLower = body.toLowerCase()

    if (numMedia > 0 && mediaUrl) {
      if (/invoice|receipt/.test(bodyLower)) {
        await handleExpense(userId, phone, mediaUrl, body)
      } else {
        await handlePortfolio(userId, phone, mediaUrl, body || null)
      }
    } else if (body) {
      await handleQA(userId, phone, body)
    } else {
      await sendWhatsApp(phone, "I didn't catch that — try sending a question or a photo!")
    }
  } catch (err) {
    console.error('TradeDesk webhook error:', err)
    try {
      await sendWhatsApp(phone, 'Something went wrong on my end. Please try again in a moment.')
    } catch {
      // ignore send failure
    }
  }

  // Always return empty TwiML 200 to Twilio
  return new NextResponse('<Response></Response>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
