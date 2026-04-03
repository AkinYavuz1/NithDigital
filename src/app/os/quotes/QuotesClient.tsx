'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { formatCurrency } from '@/lib/taxCalc'

interface Quote { id: string; quote_number: string; client_name: string; issue_date: string; valid_until: string; total: number; status: string }

const STATUS_COLORS: Record<string, string> = {
  draft: '#9CA3AF', sent: '#3B82F6', accepted: '#10B981', declined: '#EF4444', expired: '#6B7280',
}
const TABS = ['All', 'Draft', 'Sent', 'Accepted', 'Declined']

export default function QuotesClient() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [tab, setTab] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: rows } = await supabase.from('quotes').select('*, clients(name)').eq('user_id', data.user.id).order('created_at', { ascending: false })
      setQuotes((rows || []).map((r: { id: string; quote_number: string; clients: { name: string } | null; issue_date: string; valid_until: string; total: number; status: string }) => ({
        id: r.id, quote_number: r.quote_number, client_name: r.clients?.name ?? 'Unknown',
        issue_date: r.issue_date, valid_until: r.valid_until, total: Number(r.total), status: r.status,
      })))
      setLoading(false)
    })
  }, [])

  const filtered = tab === 'All' ? quotes : quotes.filter(q => q.status === tab.toLowerCase())

  return (
    <div>
      <OSPageHeader title="Quotes" description="Create and manage client quotes"
        action={
          <Link href="/os/quotes/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> New quote
          </Link>
        }
      />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', borderRadius: 8, padding: 4, width: 'fit-content', border: '1px solid rgba(27,42,74,0.08)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === t ? 600 : 400, background: tab === t ? '#1B2A4A' : 'transparent', color: tab === t ? '#F5F0E6' : '#5A6A7A' }}>{t}</button>
          ))}
        </div>
        {loading ? <div style={{ color: '#5A6A7A' }}>Loading...</div> : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#5A6A7A' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <p style={{ marginBottom: 16 }}>No quotes yet.</p>
            <Link href="/os/quotes/new" style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>Create first quote</Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F5F0E6' }}>
                  {['Quote', 'Client', 'Issued', 'Valid until', 'Total', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <tr key={q.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      <Link href={`/os/quotes/${q.id}`} style={{ color: '#2D4A7A' }}>{q.quote_number}</Link>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{q.client_name}</td>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{new Date(q.issue_date).toLocaleDateString('en-GB')}</td>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{new Date(q.valid_until).toLocaleDateString('en-GB')}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(q.total)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: `${STATUS_COLORS[q.status]}20`, color: STATUS_COLORS[q.status] }}>{q.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}><Link href={`/os/quotes/${q.id}`} style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}>View →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
