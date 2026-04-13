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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
}

async function generateUniqueSlug(businessName: string): Promise<string> {
  const base = slugify(businessName) || 'tradesperson'
  let candidate = base
  let i = 2
  while (true) {
    const { data } = await sb
      .from('tradedesk_profiles')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle()
    if (!data) return candidate
    candidate = `${base}-${i++}`
  }
}

async function generateBio(businessName: string, trade: string, areas: string): Promise<string> {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Write a short 2-sentence professional bio for a UK tradesperson.
Business: ${businessName}
Trade: ${trade}
Areas covered: ${areas}
Keep it factual and natural — no buzzwords. Do not include a greeting.
Return only the bio text, nothing else.`,
      }],
    })
    return (msg.content[0] as any).text.trim()
  } catch {
    return `${businessName} are experienced ${trade.toLowerCase()} professionals serving ${areas}.`
  }
}

const COLOUR_MAP: Record<string, string> = {
  '1': '#1B2A4A',
  '2': '#2D6A4F',
  '3': '#C1121F',
  '4': '#E76F51',
  '5': '#0F1729',
}

// ── Price book ───────────────────────────────────────────────────────────

async function normalisedProductName(raw: string): Promise<string> {
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 30,
      messages: [{
        role: 'user',
        content: `Normalise this building material description to a short canonical form for storage (e.g. "47x47mm regularised softwood timber 4.8m"). Remove merchant names, prices, and filler words. Return only the normalised name, nothing else.\n\nInput: ${raw}`,
      }],
    })
    return (msg.content[0] as any).text.trim().toLowerCase()
  } catch {
    return raw.toLowerCase().slice(0, 100)
  }
}

async function priceBookLookup(
  userId: string,
  question: string
): Promise<{ product: string; price: number; merchant: string | null; recorded_at: string } | null> {
  // Fetch the user's recent price book entries and let Claude match them
  const { data: entries } = await sb
    .from('tradedesk_price_book')
    .select('product, price, merchant, recorded_at')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(50)

  if (!entries || entries.length === 0) return null

  try {
    const list = entries.map((e, i) => `${i + 1}. ${e.product} — £${e.price}${e.merchant ? ` (${e.merchant})` : ''} — ${new Date(e.recorded_at).toLocaleDateString('en-GB')}`).join('\n')
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: `Does any item in this price book match the product being asked about in the question below? Reply with just the number of the matching item, or "none" if no match.\n\nQuestion: ${question}\n\nPrice book:\n${list}`,
      }],
    })
    const answer = (msg.content[0] as any).text.trim()
    const idx = parseInt(answer) - 1
    if (!isNaN(idx) && entries[idx]) return entries[idx]
  } catch {
    // fall through
  }
  return null
}

const CORRECTION_PATTERNS = [
  /i (got|paid|get|pay|bought|buy).{0,30}£[\d.]+/i,
  /£[\d.]+ (last time|previously|before|usually|normally|always)/i,
  /that'?s (wrong|not right|off|too high|incorrect)/i,
  /actually.{0,20}£[\d.]+/i,
  /no[,.]?.{0,20}£[\d.]+/i,
  /it'?s.{0,10}£[\d.]+/i,
]

function isPriceCorrection(text: string): boolean {
  return CORRECTION_PATTERNS.some((p) => p.test(text))
}

function extractPriceFromCorrection(text: string): number | null {
  const match = text.match(/£([\d.]+)/)
  if (!match) return null
  const val = parseFloat(match[1])
  return isNaN(val) ? null : val
}

function extractMerchantFromCorrection(text: string, knownMerchants: string | null): string | null {
  if (!knownMerchants) return null
  const lower = text.toLowerCase()
  for (const m of knownMerchants.split(/[,;]+/).map((s) => s.trim())) {
    if (lower.includes(m.toLowerCase())) return m
  }
  return null
}

async function savePriceCorrection(
  userId: string,
  correctionText: string,
  lastBotMessage: string,
  knownMerchants: string | null
): Promise<void> {
  const price = extractPriceFromCorrection(correctionText)
  if (!price) return

  // Derive the product from the last bot price message
  const productRaw = lastBotMessage.slice(0, 200)
  const product = await normalisedProductName(productRaw)
  const merchant = extractMerchantFromCorrection(correctionText, knownMerchants)

  // Upsert: update if same product already exists for this user
  const { data: existing } = await sb
    .from('tradedesk_price_book')
    .select('id')
    .eq('user_id', userId)
    .eq('product', product)
    .maybeSingle()

  if (existing) {
    await sb
      .from('tradedesk_price_book')
      .update({ price, merchant, product_raw: productRaw, recorded_at: new Date().toISOString() })
      .eq('id', existing.id)
  } else {
    await sb
      .from('tradedesk_price_book')
      .insert({ user_id: userId, product, product_raw: productRaw, price, merchant })
  }
}

// ── Price detection & Perplexity lookup ──────────────────────────────────

const PRICE_KEYWORDS = [
  'how much', 'price', 'cost', 'pricing', 'charge', 'rate', 'quote',
  'per metre', 'per m', 'per length', 'per sheet', 'per bag', 'per roll',
  'jewson', 'travis perkins', 'graham', 'bss', 'screwfix', 'toolstation',
  'tf solutions', 'builders merchant', 'timber', 'pipe', 'cable', 'plasterboard',
  'insulation', 'cement', 'render', 'aggregate', 'sand', 'gravel',
]

function isPriceQuestion(text: string): boolean {
  const lower = text.toLowerCase()
  return PRICE_KEYWORDS.some((kw) => lower.includes(kw))
}

async function perplexityPriceLookup(
  question: string,
  merchants: string | null,
  tradeDiscount: number | null
): Promise<string | null> {
  const key = process.env.PERPLEXITY_API_KEY
  if (!key) return null

  const merchantContext = merchants
    ? `The tradesperson uses these merchants: ${merchants}.`
    : 'The tradesperson is based in Scotland (Dumfries & Galloway area).'

  const discountContext = tradeDiscount
    ? `They get approximately ${tradeDiscount}% trade discount off retail prices.`
    : 'Their trade discount is unknown — note any prices are likely retail and trade prices will be lower.'

  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are a UK building materials price assistant. ${merchantContext} ${discountContext}

When giving prices:
- Give specific current UK retail prices from named suppliers (Jewson, Travis Perkins, Screwfix, Toolstation, BSS, Graham, etc.)
- If trade discount is known, calculate and show the trade price too
- Be specific — give a single price or a tight range (no more than 20% spread)
- State which supplier the price is from and that prices vary by branch
- Keep the answer under 100 words
- If you cannot find a current price, say so clearly rather than guessing`,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        max_tokens: 200,
        temperature: 0.1,
      }),
    })

    if (!res.ok) return null
    const data = await res.json()
    return data?.choices?.[0]?.message?.content?.trim() || null
  } catch {
    return null
  }
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

async function handleQA(
  userId: string,
  phone: string,
  question: string,
  merchants: string | null = null,
  tradeDiscount: number | null = null
) {
  let reply = 'Sorry, I could not generate a response right now. Please try again.'

  // ── Price question: check price book first, then Perplexity ────────────
  if (isPriceQuestion(question)) {
    const bookEntry = await priceBookLookup(userId, question)
    if (bookEntry) {
      const dateStr = new Date(bookEntry.recorded_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
      const merchantStr = bookEntry.merchant ? ` at ${bookEntry.merchant}` : ''
      const priceAnswer = `From your price book: £${bookEntry.price.toFixed(2)}${merchantStr} (recorded ${dateStr}). Prices shift — worth a quick check if it's been a while.`
      await sendWhatsApp(phone, priceAnswer)
      await logMessage(userId, 'out', priceAnswer, null, 'qa')
      return
    }

    const priceAnswer = await perplexityPriceLookup(question, merchants, tradeDiscount)
    if (priceAnswer) {
      await sendWhatsApp(phone, priceAnswer)
      await logMessage(userId, 'out', priceAnswer, null, 'qa')
      return
    }
    // Fall through to Claude if both fail
  }

  try {
    // Fetch recent conversation history (excluding the current inbound
    // message which was already logged before handleQA is called)
    const { data: history } = await sb
      .from('tradedesk_messages')
      .select('direction, message_body, created_at')
      .eq('user_id', userId)
      .not('message_body', 'is', null)
      .order('created_at', { ascending: false })
      .limit(21)

    // Build alternating user/assistant messages for the API
    const historyMessages: { role: 'user' | 'assistant'; content: string }[] = []
    if (history) {
      // Skip the first row (most recent) as it's the current inbound message
      const rows = history.slice(1).reverse()
      for (const row of rows) {
        if (!row.message_body) continue
        const role = row.direction === 'in' ? 'user' as const : 'assistant' as const
        const prev = historyMessages[historyMessages.length - 1]
        if (prev && prev.role === role) {
          // Merge consecutive same-role messages
          prev.content += '\n' + row.message_body
        } else {
          historyMessages.push({ role, content: row.message_body })
        }
      }
    }
    // Ensure history starts with a user message (Claude API requirement)
    while (historyMessages.length > 0 && historyMessages[0].role !== 'user') {
      historyMessages.shift()
    }
    // Append current question, merging if last message is also from user
    const lastMsg = historyMessages[historyMessages.length - 1]
    if (lastMsg && lastMsg.role === 'user') {
      lastMsg.content += '\n' + question
    } else {
      historyMessages.push({ role: 'user', content: question })
    }

    console.log('[TradeDesk QA] history messages:', historyMessages.length, JSON.stringify(historyMessages.map(m => ({ r: m.role, c: m.content.slice(0, 30) }))))

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
      messages: historyMessages,
    })
    reply = (msg.content[0] as any).text || reply
  } catch (err) {
    console.error('[TradeDesk QA] error:', err)
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
  rawCaption: string | null,
  isPro = false
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

  const reviewLine = isPro
    ? `\n\n⭐ *Happy with the job? Send this to your customer:*\n_"Hi, I've just completed some work at your property. If you're happy with the result, I'd really appreciate a quick Google review — it only takes a minute and helps my business a lot. Here's the link: https://g.page/r/review"_`
    : ''

  const reply = `✅ Added to your portfolio!${gbpLine}\n\n*Caption:*\n${aiCaption}\n\n*Ready to share:*\n${socialPost}${connectLine}${reviewLine}`
  await sendWhatsApp(phone, reply)
  await logMessage(userId, 'out', reply, null, 'portfolio')
}

// ── Flow: Expense extraction ──────────────────────────────────────────────

async function sendExpenseEmail(
  userId: string,
  userEmail: string,
  userName: string | null,
  supplier: string,
  amountStr: string,
  dateStr: string,
  vat: number | null,
  category: string,
  invoiceNumber: string | null,
  jobTag: string | null,
  lineItems: Array<{ description: string; quantity?: number; unit_price?: number; total?: number }> | null
) {
  const greeting = userName ? `Hi ${userName.split(' ')[0]},` : 'Hi,'
  const lineItemsHtml = lineItems && lineItems.length > 0
    ? `<tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 10px 0; color: #5A6A7A; vertical-align: top;">Line items</td>
        <td style="padding: 10px 0; font-size: 12px;">
          ${lineItems.map(i => `${i.description}${i.quantity ? ` × ${i.quantity}` : ''}${i.total ? ` — £${i.total.toFixed(2)}` : ''}`).join('<br>')}
        </td>
      </tr>`
    : ''

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
              <td style="padding: 10px 0; color: #5A6A7A; width: 130px;">Supplier</td>
              <td style="padding: 10px 0; font-weight: 600;">${supplier}</td>
            </tr>
            ${invoiceNumber ? `<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; color: #5A6A7A;">Invoice #</td><td style="padding: 10px 0;">${invoiceNumber}</td></tr>` : ''}
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #5A6A7A;">Date</td>
              <td style="padding: 10px 0;">${dateStr}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #5A6A7A;">Amount</td>
              <td style="padding: 10px 0; font-weight: 600;">${amountStr}</td>
            </tr>
            ${vat !== null ? `<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; color: #5A6A7A;">VAT</td><td style="padding: 10px 0;">£${vat.toFixed(2)}</td></tr>` : ''}
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #5A6A7A;">Category</td>
              <td style="padding: 10px 0;">${category}</td>
            </tr>
            ${jobTag ? `<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; color: #5A6A7A;">Job</td><td style="padding: 10px 0;">${jobTag}</td></tr>` : ''}
            ${lineItemsHtml}
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
}

async function autoPriceBookFromLineItems(
  userId: string,
  supplier: string,
  merchants: string | null,
  lineItems: Array<{ description: string; quantity?: number; unit_price?: number; total?: number }>
) {
  if (!merchants) return
  // Only update price book if this supplier matches a known merchant
  const supplierLower = supplier.toLowerCase()
  const isKnownMerchant = merchants.split(/[,;]+/).some((m) =>
    supplierLower.includes(m.trim().toLowerCase()) || m.trim().toLowerCase().includes(supplierLower)
  )
  if (!isKnownMerchant) return

  for (const item of lineItems) {
    if (!item.description || (!item.unit_price && !item.total)) continue
    const price = item.unit_price ?? (item.total && item.quantity ? item.total / item.quantity : item.total)
    if (!price) continue

    const product = await normalisedProductName(item.description)
    const { data: existing } = await sb
      .from('tradedesk_price_book')
      .select('id')
      .eq('user_id', userId)
      .eq('product', product)
      .maybeSingle()

    if (existing) {
      await sb.from('tradedesk_price_book')
        .update({ price, merchant: supplier, product_raw: item.description, recorded_at: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      await sb.from('tradedesk_price_book')
        .insert({ user_id: userId, product, product_raw: item.description, price, merchant: supplier })
    }
  }
}

async function handleExpenseFromBuffer(
  userId: string,
  phone: string,
  buffer: Buffer,
  contentType: string,
  messageBody: string,
  userEmail: string | null,
  userName: string | null,
  merchants: string | null = null
) {
  const ext = getExt(contentType)
  const path = `${userId}/expenses/${Date.now()}-${shortId()}.${ext}`
  const imageUrl = await uploadToStorage(buffer, contentType, path)

  let supplier = 'Unknown'
  let date: string | null = null
  let amount: number | null = null
  let vat: number | null = null
  let category = 'Other'
  let invoiceNumber: string | null = null
  let lineItems: Array<{ description: string; quantity?: number; unit_price?: number; total?: number }> | null = null
  let confidence: 'high' | 'low' = 'high'
  let rawText = ''

  try {
    const base64 = buffer.toString('base64')
    const mediaType = contentType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
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
              text: `This is an invoice, receipt, or delivery note from a UK tradesperson.

Extract ALL of the following and respond in this exact JSON format:
{
  "supplier": "company name or person who issued this",
  "invoice_number": "invoice or receipt number, or null if not found",
  "date": "YYYY-MM-DD or null if not found",
  "amount": numeric total amount in GBP excluding VAT, or null,
  "vat": numeric VAT amount in GBP, or null,
  "category": one of: Materials, Tools, Fuel, Insurance, Subcontractor, Office, Vehicle, Other,
  "line_items": [
    { "description": "item name", "quantity": numeric or null, "unit_price": numeric or null, "total": numeric or null }
  ],
  "confidence": "high" if you can clearly read the key fields, "low" if the image is unclear, partial, or key fields are missing
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
    invoiceNumber = parsed.invoice_number || null
    date = parsed.date || null
    amount = typeof parsed.amount === 'number' ? parsed.amount : null
    vat = typeof parsed.vat === 'number' ? parsed.vat : null
    category = parsed.category || category
    lineItems = Array.isArray(parsed.line_items) && parsed.line_items.length > 0 ? parsed.line_items : null
    confidence = parsed.confidence === 'low' ? 'low' : 'high'
  } catch {
    confidence = 'low'
  }

  // ── Duplicate detection ──────────────────────────────────────────────────
  if (supplier !== 'Unknown' && date && amount !== null) {
    const { data: duplicate } = await sb
      .from('tradedesk_expenses')
      .select('id')
      .eq('user_id', userId)
      .eq('supplier', supplier)
      .eq('date', date)
      .eq('amount', amount)
      .maybeSingle()

    if (duplicate) {
      const reply = `⚠️ Looks like I've already logged this one — *${supplier}* £${amount.toFixed(2)} on ${date}. Send it again if it's a different invoice.`
      await sendWhatsApp(phone, reply)
      await logMessage(userId, 'out', reply, null, 'expense')
      return
    }
  }

  // ── Insert expense ───────────────────────────────────────────────────────
  const { data: expenseRow } = await sb.from('tradedesk_expenses').insert({
    user_id: userId,
    image_url: imageUrl,
    supplier,
    date,
    amount,
    vat,
    category,
    raw_text: rawText,
    invoice_number: invoiceNumber,
    line_items: lineItems,
    confidence,
  }).select('id').single()

  const expenseId = expenseRow?.id || null
  const amountStr = amount !== null ? `£${amount.toFixed(2)}` : '(amount not found)'
  const vatStr = vat !== null ? ` + £${vat.toFixed(2)} VAT` : ''
  const dateStr = date || 'date not found'

  // ── Auto price book from line items ─────────────────────────────────────
  if (lineItems && lineItems.length > 0) {
    autoPriceBookFromLineItems(userId, supplier, merchants, lineItems).catch(() => {})
  }

  // ── Low confidence: ask for missing fields ───────────────────────────────
  if (confidence === 'low') {
    const missing: string[] = []
    if (amount === null) missing.push('total amount')
    if (!date) missing.push('date')
    if (supplier === 'Unknown') missing.push('supplier name')

    const lowConfReply = missing.length > 0
      ? `I logged it but couldn't read the ${missing.join(' and ')} clearly — can you type ${missing.length > 1 ? 'them' : 'it'}? I'll update the record.\n\n*(${supplier !== 'Unknown' ? supplier : 'Unknown supplier'} — ${dateStr})*`
      : `✅ Expense logged!\n\n*${supplier}*\n${amountStr}${vatStr}\n${dateStr}\nCategory: ${category}${invoiceNumber ? `\nInvoice: ${invoiceNumber}` : ''}\n\n_(Image was a bit unclear — double check this looks right)_`

    await sendWhatsApp(phone, lowConfReply)
    await logMessage(userId, 'out', lowConfReply, null, 'expense')

    // Ask for job tag after low confidence notice
    if (expenseId) {
      await sb.from('tradedesk_users').update({
        pending_action: 'awaiting_job_tag',
        pending_expense_id: expenseId,
      }).eq('id', userId)
    }
    return
  }

  // ── Normal confirmation ──────────────────────────────────────────────────
  const lineItemSummary = lineItems && lineItems.length > 0
    ? `\n_${lineItems.length} line item${lineItems.length > 1 ? 's' : ''} logged_`
    : ''

  const reply = `✅ Expense logged!\n\n*${supplier}*\n${amountStr}${vatStr}\n${dateStr}\nCategory: ${category}${invoiceNumber ? `\nInvoice: ${invoiceNumber}` : ''}${lineItemSummary}`
  await sendWhatsApp(phone, reply)
  await logMessage(userId, 'out', reply, null, 'expense')

  // Ask for job tag
  if (expenseId) {
    const jobPrompt = `Which job is this for? Reply with a job name (e.g. "Smith bathroom") or *skip*.`
    await sendWhatsApp(phone, jobPrompt)
    await logMessage(userId, 'out', jobPrompt, null, 'expense')
    await sb.from('tradedesk_users').update({
      pending_action: 'awaiting_job_tag',
      pending_expense_id: expenseId,
    }).eq('id', userId)
  }

  // Send email receipt
  if (userEmail) {
    try {
      await sendExpenseEmail(userId, userEmail, userName, supplier, amountStr, dateStr, vat, category, invoiceNumber, null, lineItems)
    } catch {
      // Email failure non-fatal
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
  // Lookup or create user + profile (for merchants/discount)
  let { data: user } = await sb
    .from('tradedesk_users')
    .select('id, email, name, business_name, pending_action, pending_media_url, pending_media_type, stripe_plan, pending_onboarding_data, merchants, pending_expense_id')
    .eq('phone_number', phone)
    .single()

  if (!user) {
    // Unknown number — check if they're submitting an access code
    const trimmed = body.trim().toUpperCase()
    const { data: codeRow } = await sb
      .from('tradedesk_access_codes')
      .select('id, code, expires_at, used_by')
      .eq('code', trimmed)
      .single()

    if (!codeRow) {
      // Not a valid code — invite-only rejection
      await sendWhatsApp(
        phone,
        `Hi! TradeDesk is currently invite-only.\n\nIf you've been given an access code, reply with it now. Otherwise, contact Nith Digital at nithdigital.uk to request access.`
      )
      return
    }

    if (codeRow.used_by) {
      await sendWhatsApp(phone, `That access code has already been used. Contact Nith Digital at nithdigital.uk if you need help.`)
      return
    }

    if (codeRow.expires_at && new Date(codeRow.expires_at) < new Date()) {
      await sendWhatsApp(phone, `That access code has expired. Contact Nith Digital at nithdigital.uk for a new one.`)
      return
    }

    // Valid code — create user and mark code as used
    const { data: newUser } = await sb
      .from('tradedesk_users')
      .insert({ phone_number: phone, pending_action: 'awaiting_email' })
      .select('id, email, name, business_name, pending_action, pending_media_url, pending_media_type')
      .single()
    user = newUser

    await sb
      .from('tradedesk_access_codes')
      .update({ used_by: user!.id, used_at: new Date().toISOString() })
      .eq('id', codeRow.id)

    const planLabel = codeRow.notes?.includes('pro') ? 'Pro' : 'Starter'
    const welcome = `Welcome to *TradeDesk ${planLabel}* by Nith Digital! 👋\n\nI'm your trade assistant — ask me anything, send job photos, or photograph invoices and I'll log them for you.\n\nFirst things first — what's your email address? I'll use it to send you a receipt every time I log an expense.`
    await sendWhatsApp(phone, welcome)
    await logMessage(user!.id, 'out', welcome, null, null)
    return
  }

  const userId = user!.id

  // Fetch profile for trade_discount (non-blocking — null if not found)
  const { data: profile } = await sb
    .from('tradedesk_profiles')
    .select('trade_discount')
    .eq('user_id', userId)
    .maybeSingle()
  const tradeDiscount: number | null = profile?.trade_discount ?? null
  const merchants: string | null = user!.merchants ?? null

  // Log inbound message
  await logMessage(userId, 'in', body || null, mediaUrl, null)

  try {
    // ── State: awaiting email ──────────────────────────────────────────────
    if (user.pending_action === 'awaiting_email') {
      if (isValidEmail(body)) {
        const isPro = user.stripe_plan === 'pro'

        // Check if Pro user already has a profile (don't re-onboard)
        const { data: existingProfile } = isPro
          ? await sb.from('tradedesk_profiles').select('id, slug').eq('user_id', userId).single()
          : { data: null }

        if (isPro && !existingProfile) {
          await sb.from('tradedesk_users').update({
            email: body.trim().toLowerCase(),
            pending_action: 'onboarding_business_name',
            pending_onboarding_data: {},
          }).eq('id', userId)

          const reply = `Got it ✅\n\nBefore we get started, let's build your free TradeDesk website — takes 2 minutes.\n\nWhat's your *business name*?`
          await sendWhatsApp(phone, reply)
          await logMessage(userId, 'out', reply, null, null)
        } else {
          await sb.from('tradedesk_users').update({
            email: body.trim().toLowerCase(),
            pending_action: null,
          }).eq('id', userId)

          const planNote = isPro && existingProfile
            ? `\n\n🌐 Your website: https://${existingProfile.slug}.nithdigital.uk`
            : ''
          const reply = `Got it ✅\n\nYou're all set. Here's what I can do:\n\n• Text me a *question* — I'll answer it\n• Send a *job photo* — I'll add it to your portfolio automatically\n• Send an *invoice or receipt photo* — I'll extract the details, log it, and email you a copy${planNote}\n\nFire away.`
          await sendWhatsApp(phone, reply)
          await logMessage(userId, 'out', reply, null, null)
        }
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
        await handlePortfolioFromBuffer(userId, phone, buffer, contentType, null, user.stripe_plan === 'pro')
      } else if (choice.includes('2') || choice.includes('invoice') || choice.includes('receipt') || choice.includes('expense')) {
        const { buffer, contentType } = await downloadTwilioMedia(storedMediaUrl)
        await handleExpenseFromBuffer(userId, phone, buffer, contentType, body, user.email, user.name || user.business_name, merchants)
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

    // ── State: awaiting job tag ───────────────────────────────────────────
    if (user.pending_action === 'awaiting_job_tag' && user.pending_expense_id) {
      const expenseId = user.pending_expense_id
      const skip = body.trim().toLowerCase() === 'skip'

      await sb.from('tradedesk_users').update({
        pending_action: null,
        pending_expense_id: null,
      }).eq('id', userId)

      if (!skip) {
        const jobTag = body.trim()
        await sb.from('tradedesk_expenses').update({ job_tag: jobTag }).eq('id', expenseId)

        // Now send the email with job tag included
        const { data: exp } = await sb
          .from('tradedesk_expenses')
          .select('supplier, amount, vat, date, category, invoice_number, line_items')
          .eq('id', expenseId)
          .single()

        if (exp && user.email) {
          const amountStr = exp.amount !== null ? `£${Number(exp.amount).toFixed(2)}` : '(amount not found)'
          const dateStr = exp.date || 'date not found'
          try {
            await sendExpenseEmail(userId, user.email, user.name, exp.supplier, amountStr, dateStr, exp.vat, exp.category, exp.invoice_number, jobTag, exp.line_items)
          } catch { /* non-fatal */ }
        }

        const reply = `Got it — tagged to *${jobTag}*. 👍`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, 'expense')
      } else {
        // Skipped — send email without job tag
        const { data: exp } = await sb
          .from('tradedesk_expenses')
          .select('supplier, amount, vat, date, category, invoice_number, line_items')
          .eq('id', expenseId)
          .single()

        if (exp && user.email) {
          const amountStr = exp.amount !== null ? `£${Number(exp.amount).toFixed(2)}` : '(amount not found)'
          const dateStr = exp.date || 'date not found'
          try {
            await sendExpenseEmail(userId, user.email, user.name, exp.supplier, amountStr, dateStr, exp.vat, exp.category, exp.invoice_number, null, exp.line_items)
          } catch { /* non-fatal */ }
        }
      }
      return
    }

    // ── Onboarding states (Pro users) ─────────────────────────────────────
    const onboardingStates = [
      'onboarding_business_name',
      'onboarding_trade',
      'onboarding_areas',
      'onboarding_phone',
      'onboarding_social',
      'onboarding_merchants',
      'onboarding_discount',
      'onboarding_colour',
      'onboarding_logo',
    ]

    if (onboardingStates.includes(user.pending_action || '')) {
      const od: Record<string, any> = user.pending_onboarding_data || {}
      const input = body.trim()
      const skip = input.toLowerCase() === 'skip'

      if (user.pending_action === 'onboarding_business_name') {
        if (!input) {
          await sendWhatsApp(phone, `What's your business name?`)
          return
        }
        await sb.from('tradedesk_users').update({
          pending_action: 'onboarding_trade',
          pending_onboarding_data: { ...od, business_name: input },
        }).eq('id', userId)
        const reply = `*${input}* — got it.\n\nWhat trade are you in? (e.g. Plumber, Electrician, Builder, Joiner, Roofer...)`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return

      } else if (user.pending_action === 'onboarding_trade') {
        if (!input) {
          await sendWhatsApp(phone, `What trade are you in?`)
          return
        }
        await sb.from('tradedesk_users').update({
          pending_action: 'onboarding_areas',
          pending_onboarding_data: { ...od, trade: input },
        }).eq('id', userId)
        const reply = `Which areas do you cover? (e.g. Dumfries, Thornhill, Castle Douglas, or just "Dumfries & Galloway")`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return

      } else if (user.pending_action === 'onboarding_areas') {
        if (!input) {
          await sendWhatsApp(phone, `Which areas do you cover?`)
          return
        }
        await sb.from('tradedesk_users').update({
          pending_action: 'onboarding_phone',
          pending_onboarding_data: { ...od, areas: input },
        }).eq('id', userId)
        const reply = `What's the best phone number for customers to call?\n(This will appear on your website)`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return

      } else if (user.pending_action === 'onboarding_phone') {
        if (!input) {
          await sendWhatsApp(phone, `What phone number should we show on your website?`)
          return
        }
        await sb.from('tradedesk_users').update({
          pending_action: 'onboarding_social',
          pending_onboarding_data: { ...od, phone: input },
        }).eq('id', userId)
        const reply = `Got any social media links? Send them now (Facebook, Instagram, etc.) or reply *skip* to leave blank.`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return

      } else if (user.pending_action === 'onboarding_social') {
        const socialData = skip ? null : { raw: input }
        await sb.from('tradedesk_users').update({
          pending_action: 'onboarding_merchants',
          pending_onboarding_data: { ...od, social_links: socialData },
        }).eq('id', userId)
        const reply = `Which builders merchants do you use most? (e.g. Jewson Dumfries, Travis Perkins, Graham, BSS, local independent)\n\nI'll use this to give you accurate material prices.`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return

      } else if (user.pending_action === 'onboarding_merchants') {
        await sb.from('tradedesk_users').update({
          pending_action: 'onboarding_discount',
          pending_onboarding_data: { ...od, merchants: skip ? null : input },
        }).eq('id', userId)
        const reply = `Do you know roughly what trade discount you get at your merchants? (e.g. "20%" or "about 15-20%")\n\nReply *skip* if you're not sure — I'll note the retail price and flag it.`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return

      } else if (user.pending_action === 'onboarding_discount') {
        // Extract a number from their answer e.g. "about 20%" → 20
        const discountMatch = input.match(/\d+/)
        const discount = skip || !discountMatch ? null : parseInt(discountMatch[0])
        await sb.from('tradedesk_users').update({
          pending_action: 'onboarding_colour',
          pending_onboarding_data: { ...od, trade_discount: discount },
        }).eq('id', userId)
        const reply = `Got it${discount ? ` — ${discount}% trade discount noted` : ''}.\n\nPick an accent colour for your website:\n\n1️⃣ Navy blue\n2️⃣ Forest green\n3️⃣ Deep red\n4️⃣ Burnt orange\n5️⃣ Charcoal\n\nReply with a number (1–5)`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return

      } else if (user.pending_action === 'onboarding_colour') {
        const colour = COLOUR_MAP[input] || COLOUR_MAP['1']
        await sb.from('tradedesk_users').update({
          pending_action: 'onboarding_logo',
          pending_onboarding_data: { ...od, accent_colour: colour },
        }).eq('id', userId)
        const reply = `Almost done! Send your *logo* as a photo, or reply *skip* to use a text header instead.`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return

      } else if (user.pending_action === 'onboarding_logo') {
        let logo_url: string | null = null

        if (!skip && numMedia > 0 && mediaUrl) {
          try {
            const { buffer, contentType } = await downloadTwilioMedia(mediaUrl)
            const ext = getExt(contentType)
            const path = `${userId}/logos/${Date.now()}.${ext}`
            logo_url = await uploadToStorage(buffer, contentType, path)
          } catch {
            // Non-fatal — proceed without logo
          }
        }

        // Complete onboarding
        const finalData = { ...od, logo_url }
        const businessName = finalData.business_name || 'My Business'
        const trade = finalData.trade || 'Tradesperson'
        const areas = finalData.areas || 'Local area'

        const [bio, slug] = await Promise.all([
          generateBio(businessName, trade, areas),
          generateUniqueSlug(businessName),
        ])

        await sb.from('tradedesk_profiles').insert({
          user_id: userId,
          slug,
          business_name: businessName,
          trade,
          areas,
          phone: finalData.phone || null,
          social_links: finalData.social_links || {},
          logo_url,
          accent_colour: finalData.accent_colour || '#1B2A4A',
          bio,
          trade_discount: finalData.trade_discount ?? null,
          published: true,
        })

        await sb.from('tradedesk_users').update({
          pending_action: null,
          pending_onboarding_data: {},
          business_name: businessName,
          merchants: finalData.merchants || null,
        }).eq('id', userId)

        const siteUrl = `https://${slug}.nithdigital.uk`
        const reply = `🎉 Your website is live!\n\n${siteUrl}\n\nEvery job photo you send me will appear on it automatically.\n\nNow — ask me anything, send job photos, or photograph invoices and I'll log them.`
        await sendWhatsApp(phone, reply)
        await logMessage(userId, 'out', reply, null, null)
        return
      }
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
        await handleExpenseFromBuffer(userId, phone, buffer, contentType, body, user.email, user.name || user.business_name, merchants)
      } else if (detected === 'portfolio') {
        // AI confident it's a job photo — confirm and process
        const confirmMsg = `Nice work! Adding that to your portfolio...`
        await sendWhatsApp(phone, confirmMsg)
        await logMessage(userId, 'out', confirmMsg, null, null)
        await handlePortfolioFromBuffer(userId, phone, buffer, contentType, body || null, user.stripe_plan === 'pro')
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
      // ── Price correction detection ───────────────────────────────────────
      if (isPriceCorrection(body)) {
        // Fetch the last outbound message to derive the product
        const { data: lastOut } = await sb
          .from('tradedesk_messages')
          .select('message_body')
          .eq('user_id', userId)
          .eq('direction', 'out')
          .eq('flow', 'qa')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (lastOut?.message_body) {
          await savePriceCorrection(userId, body, lastOut.message_body, merchants)
          const price = extractPriceFromCorrection(body)
          const ackReply = `Got it — I'll use £${price?.toFixed(2)} for that next time. Noted in your price book. 👍`
          await sendWhatsApp(phone, ackReply)
          await logMessage(userId, 'out', ackReply, null, 'qa')
          return
        }
      }

      await handleQA(userId, phone, body, merchants, tradeDiscount)
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
