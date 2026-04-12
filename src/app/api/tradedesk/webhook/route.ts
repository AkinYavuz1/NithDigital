export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const resend = new Resend(process.env.RESEND_API_KEY!)

const WHATSAPP_FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
const BASE_URL = 'https://www.nithdigital.uk'

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

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

// ── AI photo type detection ───────────────────────────────────────────────

async function detectPhotoType(
  buffer: Buffer,
  contentType: string,
  caption: string | null
): Promise<'portfolio' | 'expense' | 'unknown'> {
  try {
    const base64 = buffer.toString('base64')
    const mediaType = contentType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
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
              text: `Look at this image${caption ? ` (the sender added: "${caption}")` : ''}.

Is this:
A) An invoice, receipt, delivery note, or financial document
B) A photo of a completed trade job, work in progress, or site photo

Reply with only the letter A or B.`,
            },
          ],
        },
      ],
    })

    const answer = (msg.content[0] as any).text.trim().toUpperCase()
    if (answer.startsWith('A')) return 'expense'
    if (answer.startsWith('B')) return 'portfolio'
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

// ── Flow: Groq Q&A ────────────────────────────────────────────────────────

async function handleQA(userId: string, phone: string, question: string) {
  let reply = 'Sorry, I could not generate a response right now. Please try again.'

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: `You are TradeDesk, a no-nonsense trade assistant built for Scottish tradespeople — plumbers, electricians, builders, joiners, plasterers, roofers, landscapers, gas engineers, painters, and all other trades. You're powered by Nith Digital.

You know Scotland inside out: Scottish Building Standards (not English Building Regs), SNIPEF for plumbing, SELECT for electricians, local pricing in Dumfries & Galloway, the Borders, Ayrshire, and the Central Belt. You know that D&G is rural and remote — travel time, fuel, and access matter more here than in cities.

GREETING BEHAVIOUR:
If the message is a greeting (hi, hello, hey, morning, etc.) or very short with no clear question, respond with a friendly but brief intro. Example: "Morning! TradeDesk here — your trade assistant from Nith Digital. Got a job to price, a regs question, or need supplier info? Fire away."

PRICING/COSTING QUESTIONS:
When someone asks what to charge or how to price a job, do NOT give a number straight away. First ask 2-3 short clarifying questions to give an accurate estimate. Keep the questions short — one message, numbered, no fluff. Once they answer, give a detailed breakdown.

HOW TO ANSWER EVERYTHING ELSE:
- Be direct and practical. No waffle, no corporate speak.
- Give actual numbers when asked about pricing — ranges are fine but be specific (e.g. "£180–£250/day labour for a plumber in D&G, materials on top").
- Always mention VAT if relevant (VAT threshold £90k turnover, 20% standard rate, flat rate scheme option).
- Mention CIS (Construction Industry Scheme) when subcontractors or larger jobs come up.
- For materials, think Scottish suppliers: Jewson, Travis Perkins, Graham, BSS, TF Solutions, local builders merchants.
- For regulations: Scottish Building Standards (BSD), Gas Safe, NICEIC/NAPIT, SNIPEF, SELECT, CHAS.
- Factor in: labour, materials, plant hire, travel (especially rural D&G), waste disposal, and margin (20–30% is normal).
- Keep answers under 200 words unless the question genuinely needs more.
- No bullet points with headers — just plain conversational text with line breaks if needed.
- Never say "it depends" without immediately saying what it depends on and giving numbers for each scenario.`,
      messages: [{ role: 'user', content: question }],
    })
    reply = (msg.content[0] as any).text || reply
  } catch {
    // fall through to default reply
  }

  await sendWhatsApp(phone, reply)
  await logMessage(userId, 'out', reply, null, 'qa')
}

// ── Google Business Profile helper ───────────────────────────────────────

async function postPhotoToGBP(
  refreshToken: string,
  locationName: string,
  imageUrl: string,
  caption: string
): Promise<void> {
  // Exchange refresh token for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_GBP_CLIENT_ID!,
      client_secret: process.env.GOOGLE_GBP_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const { access_token } = await tokenRes.json()
  if (!access_token) throw new Error('Failed to refresh GBP access token')

  // POST photo to GBP media endpoint
  await fetch(
    `https://mybusiness.googleapis.com/v4/${locationName}/media`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mediaFormat: 'PHOTO',
        locationAssociation: { category: 'ADDITIONAL' },
        sourceUrl: imageUrl,
        description: caption,
      }),
    }
  )
}

// ── Flow: Portfolio photo ─────────────────────────────────────────────────

async function handlePortfolioFromBuffer(
  userId: string,
  phone: string,
  buffer: Buffer,
  contentType: string,
  rawCaption: string | null
) {
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

  // Fetch user's Google tokens
  const { data: userData } = await sb
    .from('tradedesk_users')
    .select('google_refresh_token, google_location_name')
    .eq('id', userId)
    .single()

  let gbpPosted = false
  if (userData?.google_refresh_token && userData?.google_location_name) {
    try {
      await postPhotoToGBP(
        userData.google_refresh_token,
        userData.google_location_name,
        imageUrl,
        aiCaption
      )
      gbpPosted = true
    } catch {
      // Non-fatal — portfolio saved regardless
    }
  }

  const gbpLine = gbpPosted ? '\n📍 Also posted to your Google Business listing.' : ''
  const connectLine = !userData?.google_refresh_token
    ? `\n\n💡 *Want this on Google too?* Connect your Google Business in 10 seconds:\n${BASE_URL}/tradedesk/${userId}/connect`
    : ''

  const reply = `✅ Added to your portfolio!${gbpLine}\n\n*Caption:*\n${aiCaption}\n\n*Ready to share:*\n${socialPost}${connectLine}`
  await sendWhatsApp(phone, reply)
  await logMessage(userId, 'out', reply, null, 'portfolio')
}

// ── Flow: Expense extraction ──────────────────────────────────────────────

async function handleExpenseFromBuffer(
  userId: string,
  phone: string,
  buffer: Buffer,
  contentType: string,
  messageBody: string,
  userEmail: string | null,
  userName: string | null
) {
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

  // Send email receipt if we have an address
  if (userEmail) {
    try {
      const greeting = userName ? `Hi ${userName.split(' ')[0]},` : 'Hi,'
      await resend.emails.send({
        from: 'TradeDesk <hello@mail.nithdigital.uk>',
        to: userEmail,
        subject: `Expense logged — ${supplier} ${amountStr} | ${dateStr}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1B2A4A;">
            <div style="background: #1B2A4A; padding: 24px 32px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #D4A84B; font-size: 20px; margin: 0;">TradeDesk</h1>
              <p style="color: rgba(245,240,230,0.6); font-size: 13px; margin: 4px 0 0;">by Nith Digital</p>
            </div>
            <div style="background: #fff; padding: 28px 32px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="margin: 0 0 20px;">${greeting}</p>
              <p style="margin: 0 0 20px;">I've logged the following expense from your WhatsApp photo:</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px 0; color: #5A6A7A; width: 120px;">Supplier</td>
                  <td style="padding: 10px 0; font-weight: 600;">${supplier}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px 0; color: #5A6A7A;">Date</td>
                  <td style="padding: 10px 0;">${dateStr}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 10px 0; color: #5A6A7A;">Amount</td>
                  <td style="padding: 10px 0; font-weight: 600;">${amountStr}</td>
                </tr>
                ${vat !== null ? `<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; color: #5A6A7A;">VAT</td><td style="padding: 10px 0;">£${vat.toFixed(2)}</td></tr>` : ''}
                <tr>
                  <td style="padding: 10px 0; color: #5A6A7A;">Category</td>
                  <td style="padding: 10px 0;">${category}</td>
                </tr>
              </table>
              <div style="margin-top: 28px; display: flex; gap: 12px;">
                <a href="${BASE_URL}/tradedesk/${userId}/expenses" style="display: inline-block; background: #1B2A4A; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">View all expenses</a>
                <a href="${BASE_URL}/api/tradedesk/${userId}/expenses/export" style="display: inline-block; background: #D4A84B; color: #1B2A4A; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">Download CSV</a>
              </div>
            </div>
            <div style="background: #f9f8f5; padding: 16px 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 11px; color: #5A6A7A; margin: 0;">TradeDesk by Nith Digital · <a href="https://nithdigital.uk/tradedesk" style="color: #D4A84B;">nithdigital.uk/tradedesk</a></p>
            </div>
          </div>
        `,
      })
    } catch {
      // Email failure shouldn't break the flow
    }
  }
}

// ── Main handler ─────────────────────────────────────────────────────────

async function processMessage(
  phone: string,
  body: string,
  numMedia: number,
  mediaUrl: string | null,
  mediaContentType: string,
) {
  // Lookup or create user
  let { data: user } = await sb
    .from('tradedesk_users')
    .select('id, email, name, business_name, pending_action, pending_media_url, pending_media_type')
    .eq('phone_number', phone)
    .single()

  if (!user) {
    const { data: newUser } = await sb
      .from('tradedesk_users')
      .insert({ phone_number: phone, pending_action: 'awaiting_email' })
      .select('id, email, name, business_name, pending_action, pending_media_url, pending_media_type')
      .single()
    user = newUser

    const welcome = `Welcome to *TradeDesk* by Nith Digital! 👋\n\nI'm your trade assistant — ask me anything, send job photos, or photograph invoices and I'll log them for you.\n\nFirst things first — what's your email address? I'll use it to send you a receipt every time I log an expense.`
    await sendWhatsApp(phone, welcome)
    await logMessage(user!.id, 'out', welcome, null, null)
    return
  }

  const userId = user!.id

  // Log inbound message
  await logMessage(userId, 'in', body || null, mediaUrl, null)

  try {
    // ── State: awaiting email ──────────────────────────────────────────────
    if (user.pending_action === 'awaiting_email') {
      if (isValidEmail(body)) {
        await sb.from('tradedesk_users').update({
          email: body.trim().toLowerCase(),
          pending_action: null,
        }).eq('id', userId)

        const reply = `Got it ✅\n\nYou're all set. Here's what I can do:\n\n• Text me a *question* — I'll answer it\n• Send a *job photo* — I'll add it to your portfolio automatically\n• Send an *invoice or receipt photo* — I'll extract the details, log it, and email you a copy\n\nFire away.`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
      } else {
        const reply = `That doesn't look like a valid email — can you double-check and send it again?`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
      }
      return new NextResponse('<Response></Response>', {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // ── State: awaiting photo type ─────────────────────────────────────────
    if (user.pending_action === 'awaiting_photo_type' && user.pending_media_url) {
      const choice = body.toLowerCase()
      const storedMediaUrl = user.pending_media_url
      const storedMediaType = user.pending_media_type || 'image/jpeg'

      // Clear pending state immediately
      await sb.from('tradedesk_users').update({
        pending_action: null,
        pending_media_url: null,
        pending_media_type: null,
      }).eq('id', userId)

      if (choice.includes('1') || choice.includes('portfolio')) {
        const { buffer, contentType } = await downloadTwilioMedia(storedMediaUrl)
        await handlePortfolioFromBuffer(userId, phone, buffer, contentType, null)
      } else if (choice.includes('2') || choice.includes('invoice') || choice.includes('receipt') || choice.includes('expense')) {
        const { buffer, contentType } = await downloadTwilioMedia(storedMediaUrl)
        await handleExpenseFromBuffer(userId, phone, buffer, contentType, body, user.email, user.name || user.business_name)
      } else {
        const reply = `No problem — just reply *1* for portfolio or *2* for invoice/expense and I'll sort it.`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        // Restore pending state
        await sb.from('tradedesk_users').update({
          pending_action: 'awaiting_photo_type',
          pending_media_url: storedMediaUrl,
          pending_media_type: storedMediaType,
        }).eq('id', userId)
      }

      return new NextResponse('<Response></Response>', {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // ── Normal routing ─────────────────────────────────────────────────────
    const bodyLower = body.toLowerCase()

    // Detect location share (Twilio sends lat/long as text with no media)
    const isLocationShare = body.startsWith('https://maps.google.com') ||
      body.startsWith('https://www.google.com/maps') ||
      /^-?\d+\.\d+,-?\d+\.\d+$/.test(body.trim())

    if (isLocationShare) {
      const reply = `Got your location — thanks! If you need a price for a job at that address just ask me and I'll factor in travel.`
      await sendWhatsApp(phone, reply)
      await logMessage(userId, 'out', reply, null, 'qa')
      return new NextResponse('<Response></Response>', {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    if (numMedia > 0 && mediaUrl) {
      // Skip non-image media (voice notes, video, location attachments)
      const isImage = mediaContentType.startsWith('image/')
      if (!isImage) {
        const reply = `I can only handle photos right now — voice notes and videos aren't supported yet. Send me a photo or just type your question!`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, 'qa')
        return new NextResponse('<Response></Response>', {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        })
      }

      // Download once — used for detection and then passed to the flow
      const { buffer, contentType } = await downloadTwilioMedia(mediaUrl)
      const detected = await detectPhotoType(buffer, contentType, body || null)

      if (detected === 'expense') {
        // AI confident it's an invoice/receipt — confirm and process
        const confirmMsg = `That looks like an invoice or receipt — logging it as an expense now...`
        await sendWhatsApp(phone, confirmMsg)
        await logMessage(userId, 'out', confirmMsg, null, null)
        await handleExpenseFromBuffer(userId, phone, buffer, contentType, body, user.email, user.name || user.business_name)
      } else if (detected === 'portfolio') {
        // AI confident it's a job photo — confirm and process
        const confirmMsg = `Nice work! Adding that to your portfolio...`
        await sendWhatsApp(phone, confirmMsg)
        await logMessage(userId, 'out', confirmMsg, null, null)
        await handlePortfolioFromBuffer(userId, phone, buffer, contentType, body || null)
      } else {
        // AI unsure — fall back to asking
        await sb.from('tradedesk_users').update({
          pending_action: 'awaiting_photo_type',
          pending_media_url: mediaUrl,
          pending_media_type: contentType,
        }).eq('id', userId)

        const reply = `Got your photo — just to be sure, what's this for?\n\n1️⃣ *Portfolio* — I'll write a caption and add it to your profile\n2️⃣ *Invoice / expense* — I'll extract the details and log it`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
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
      // ignore
    }
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const params = new URLSearchParams(rawBody)
  const paramObj = Object.fromEntries(params.entries())

  const rawFrom = params.get('From') || ''
  const body = (params.get('Body') || '').trim()
  const numMedia = parseInt(params.get('NumMedia') || '0', 10)
  const mediaUrl = params.get('MediaUrl0') || null
  const mediaContentType = params.get('MediaContentType0') || 'image/jpeg'
  const phone = rawFrom.replace(/^whatsapp:/, '')

  // Process the message fully before returning — Vercel kills the
  // function as soon as the response is sent, so fire-and-forget won't work
  await processMessage(phone, body, numMedia, mediaUrl, mediaContentType).catch((err) => {
    console.error('[TradeDesk] processMessage error:', err)
  })

  return new NextResponse('<Response></Response>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
