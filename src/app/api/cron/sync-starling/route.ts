import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ACCOUNT_UID = '7f89cb8d-7f20-4d34-89fb-fa6a043c2b0e'
const CATEGORY_UID = '7f89257c-8729-44fc-96e7-525df7eda5a7'
const BASE = 'https://api.starlingbank.com/api/v2'
const CRON_SECRET = process.env.CRON_SECRET || 'nith-cron-secret'

export const maxDuration = 60

function isAuthorized(req: NextRequest): boolean {
  return req.headers.get('Authorization') === `Bearer ${CRON_SECRET}`
}

function starlingHeaders() {
  return {
    Authorization: `Bearer ${process.env.STARLING_ACCESS_TOKEN}`,
    Accept: 'application/json',
  }
}

async function runSync() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch last 7 days of transactions (idempotent upsert covers duplicates)
  const since = new Date()
  since.setDate(since.getDate() - 7)

  const [balanceRes, txRes] = await Promise.all([
    fetch(`${BASE}/accounts/${ACCOUNT_UID}/balance`, { headers: starlingHeaders() }),
    fetch(`${BASE}/feed/account/${ACCOUNT_UID}/category/${CATEGORY_UID}?changesSince=${since.toISOString()}`, { headers: starlingHeaders() }),
  ])

  if (!balanceRes.ok) throw new Error(`Starling balance error: ${balanceRes.status}`)
  if (!txRes.ok) throw new Error(`Starling transactions error: ${txRes.status}`)

  const [balanceData, txData] = await Promise.all([balanceRes.json(), txRes.json()])

  // Upsert balance snapshot for today
  const today = new Date().toISOString().slice(0, 10)
  const { error: balErr } = await supabase.from('starling_balance_daily').upsert({
    date: today,
    cleared_balance: (balanceData.clearedBalance?.minorUnits ?? 0) / 100,
    effective_balance: (balanceData.effectiveBalance?.minorUnits ?? 0) / 100,
    pending_out: (balanceData.pendingTransactions?.minorUnits ?? 0) / 100,
    synced_at: new Date().toISOString(),
  }, { onConflict: 'date' })
  if (balErr) throw new Error(`starling_balance_daily: ${balErr.message}`)

  // Upsert transactions
  const feedItems = txData.feedItems ?? []
  let txCount = 0
  if (feedItems.length > 0) {
    const rows = feedItems.map((t: {
      feedItemUid: string
      transactionTime: string
      direction: string
      amount: { minorUnits: number; currency: string }
      counterPartyName: string
      spendingCategory: string
      status: string
      reference: string
    }) => ({
      feed_item_uid: t.feedItemUid,
      transaction_date: t.transactionTime.slice(0, 10),
      direction: t.direction,
      amount: t.amount.minorUnits / 100,
      currency: t.amount.currency,
      counter_party: t.counterPartyName,
      category: t.spendingCategory,
      status: t.status,
      reference: t.reference,
      synced_at: new Date().toISOString(),
    }))
    const { error: txErr } = await supabase
      .from('starling_transactions')
      .upsert(rows, { onConflict: 'feed_item_uid' })
    if (txErr) throw new Error(`starling_transactions: ${txErr.message}`)
    txCount = rows.length
  }

  return { date: today, transactionsSynced: txCount }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const result = await runSync()
    return NextResponse.json({ status: 'ok', ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ status: 'error', error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}
