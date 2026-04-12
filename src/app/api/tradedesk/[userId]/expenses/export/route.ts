export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params

  const { data, error } = await sb
    .from('tradedesk_expenses')
    .select('date, supplier, amount, vat, category, created_at')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = data || []

  const header = 'Date,Supplier,Amount (£),VAT (£),Category'
  const lines = rows.map((r) => {
    const date = r.date || ''
    const supplier = `"${(r.supplier || '').replace(/"/g, '""')}"`
    const amount = r.amount != null ? r.amount.toFixed(2) : ''
    const vat = r.vat != null ? r.vat.toFixed(2) : ''
    const category = r.category || ''
    return `${date},${supplier},${amount},${vat},${category}`
  })

  const csv = [header, ...lines].join('\r\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="tradedesk-expenses-${userId}.csv"`,
    },
  })
}
