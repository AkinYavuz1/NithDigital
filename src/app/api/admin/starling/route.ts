import { NextResponse } from 'next/server'

const ACCOUNT_UID = '7f89cb8d-7f20-4d34-89fb-fa6a043c2b0e'
const CATEGORY_UID = '7f89257c-8729-44fc-96e7-525df7eda5a7'
const BASE = 'https://api.starlingbank.com/api/v2'

function starlingHeaders() {
  return {
    Authorization: `Bearer ${process.env.STARLING_ACCESS_TOKEN}`,
    Accept: 'application/json',
  }
}

export async function GET() {
  const token = process.env.STARLING_ACCESS_TOKEN
  if (!token) return NextResponse.json({ error: 'No Starling token' }, { status: 500 })

  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
  const since = twelveMonthsAgo.toISOString()

  const [balanceRes, txRes] = await Promise.all([
    fetch(`${BASE}/accounts/${ACCOUNT_UID}/balance`, { headers: starlingHeaders() }),
    fetch(`${BASE}/feed/account/${ACCOUNT_UID}/category/${CATEGORY_UID}?changesSince=${since}`, { headers: starlingHeaders() }),
  ])

  if (!balanceRes.ok || !txRes.ok) {
    return NextResponse.json({ error: 'Starling API error' }, { status: 502 })
  }

  const [balanceData, txData] = await Promise.all([balanceRes.json(), txRes.json()])

  const clearedBalance = (balanceData.clearedBalance?.minorUnits ?? 0) / 100
  const effectiveBalance = (balanceData.effectiveBalance?.minorUnits ?? 0) / 100
  const pendingOut = (balanceData.pendingTransactions?.minorUnits ?? 0) / 100

  const transactions = (txData.feedItems ?? []).map((t: {
    feedItemUid: string
    transactionTime: string
    direction: string
    amount: { minorUnits: number }
    counterPartyName: string
    spendingCategory: string
    status: string
    reference: string
  }) => ({
    id: t.feedItemUid,
    date: t.transactionTime.slice(0, 10),
    direction: t.direction as 'IN' | 'OUT',
    amount: t.amount.minorUnits / 100,
    name: t.counterPartyName,
    category: t.spendingCategory,
    status: t.status,
    reference: t.reference,
  }))

  // Monthly in/out from transactions
  const monthly: Record<string, { in: number; out: number }> = {}
  for (const tx of transactions) {
    const month = tx.date.slice(0, 7)
    if (!monthly[month]) monthly[month] = { in: 0, out: 0 }
    if (tx.direction === 'IN') monthly[month].in += tx.amount
    else monthly[month].out += tx.amount
  }

  return NextResponse.json({
    clearedBalance,
    effectiveBalance,
    pendingOut,
    transactions: transactions.slice(0, 20),
    monthly,
  })
}
