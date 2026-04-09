import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Google Ads sends a GET request to verify the webhook endpoint
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('google_lead_form_key')
  if (key) {
    return new NextResponse(key, { status: 200 })
  }
  return new NextResponse('OK', { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Google Ads lead form payload structure
    const {
      user_column_data = [],
      lead_id,
      campaign_name,
    } = body

    const getField = (id: string): string =>
      user_column_data.find((f: { column_id: string; string_value: string }) =>
        f.column_id === id
      )?.string_value || ''

    const name = getField('FULL_NAME')
    const email = getField('EMAIL')
    const phone = getField('PHONE_NUMBER')
    const company = getField('COMPANY_NAME')
    const service = getField('What are you looking for?')

    if (!email && !name) {
      return NextResponse.json({ error: 'No lead data received' }, { status: 400 })
    }

    const message = [
      campaign_name ? `Source: Google Ads — ${campaign_name}` : 'Source: Google Ads Lead Form',
      lead_id ? `Lead ID: ${lead_id}` : '',
      company ? `Company: ${company}` : '',
    ].filter(Boolean).join('\n')

    const { error } = await supabase.from('contact_submissions').insert([{
      name: name || 'Google Ads Lead',
      email: email || '',
      phone: phone || null,
      service: service || null,
      message,
      status: 'new',
    }])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Google Ads webhook error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
