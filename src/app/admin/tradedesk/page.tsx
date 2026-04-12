import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import TradeDeskDashboardClient from './TradeDeskDashboardClient'

export const metadata: Metadata = {
  title: 'TradeDesk — Admin | Nith Digital',
}

export const dynamic = 'force-dynamic'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function TradeDeskAdminPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [usersRes, msgsRes, portfolioRes, expensesRes] = await Promise.all([
    sb.from('tradedesk_users').select('*').order('created_at', { ascending: false }),
    sb.from('tradedesk_messages')
      .select('id, user_id, direction, message_body, flow, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
    sb.from('tradedesk_portfolio_posts').select('id', { count: 'exact', head: true }),
    sb.from('tradedesk_expenses').select('category, amount'),
  ])

  const users = usersRes.data || []
  const messages = msgsRes.data || []
  const portfolioCount = portfolioRes.count || 0

  // Aggregate expenses by category
  const totalsMap: Record<string, number> = {}
  for (const e of expensesRes.data || []) {
    const cat = e.category || 'Other'
    totalsMap[cat] = (totalsMap[cat] || 0) + (e.amount || 0)
  }
  const categoryTotals = Object.entries(totalsMap).map(([category, total]) => ({ category, total }))

  return (
    <TradeDeskDashboardClient
      users={users}
      messages={messages}
      portfolioCount={portfolioCount}
      categoryTotals={categoryTotals}
    />
  )
}
