export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getAnthropic() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! }) }

const STATUS_MAP: Record<string, string> = {
  'Interested': 'interested',
  'Needs more info': 'contacted',
  'Not interested': 'lost',
  'Wrong person': 'contacted',
}

export async function POST(req: NextRequest) {
  const anthropic = getAnthropic()
  const { id, replyText, prospect } = await req.json()
  if (!id || !replyText) return NextResponse.json({ error: 'Missing id or replyText' }, { status: 400 })

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `You are helping Akin at Nith Digital (a web agency in Dumfries & Galloway) analyse a reply to a cold email he sent.

Prospect: ${prospect.business_name} (${prospect.sector})
Recommended service: ${prospect.recommended_service}

Reply received:
"""
${replyText}
"""

Classify the reply into exactly one of:
- Interested
- Needs more info
- Not interested
- Wrong person

Then suggest a specific next action for Akin (1–2 sentences, practical and direct).

Respond in this exact JSON format:
{
  "label": "<one of the four options above>",
  "action": "<next action suggestion>"
}`
    }]
  })

  let parsed: { label: string; action: string }
  try {
    const text = (msg.content[0] as any).text.trim()
    parsed = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Failed to parse Claude response' }, { status: 500 })
  }

  const newStatus = STATUS_MAP[parsed.label] ?? 'contacted'

  await sb.from('prospects').update({ pipeline_status: newStatus }).eq('id', id)

  return NextResponse.json({ label: parsed.label, action: parsed.action, status: newStatus })
}
