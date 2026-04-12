import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import TradeDeskExpensesClient from './TradeDeskExpensesClient'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Props {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const { data: user } = await sb
    .from('tradedesk_users')
    .select('name, business_name')
    .eq('id', userId)
    .single()

  const name = user?.business_name || user?.name || 'Tradesperson'
  return {
    title: `${name} — Expenses | TradeDesk`,
    robots: { index: false, follow: false },
  }
}

export default async function ExpensesPage({ params }: Props) {
  const { userId } = await params

  const { data: user } = await sb
    .from('tradedesk_users')
    .select('name, business_name')
    .eq('id', userId)
    .single()

  if (!user) notFound()

  const displayName = user.business_name || user.name || 'My Expenses'

  return (
    <div style={{ minHeight: '60vh', background: '#F5F0E6' }}>
      {/* Header */}
      <section style={{ background: '#1B2A4A', padding: '48px 0 36px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4A84B', marginBottom: 10, fontWeight: 600 }}>
            TradeDesk · Expenses
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 30px)',
            fontWeight: 700,
            color: '#F5F0E6',
          }}>
            {displayName}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 24px 64px' }}>
        <TradeDeskExpensesClient userId={userId} />
      </section>
    </div>
  )
}
