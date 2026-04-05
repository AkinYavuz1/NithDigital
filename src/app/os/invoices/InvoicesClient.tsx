'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { formatCurrency } from '@/lib/taxCalc'

interface Invoice {
  id: string; invoice_number: string; client_name: string
  issue_date: string; due_date: string; total: number; status: string
}

const STATUS_COLORS: Record<string, string> = {
  draft: '#9CA3AF', sent: '#3B82F6', paid: '#10B981', overdue: '#EF4444', cancelled: '#6B7280',
}
const TABS = ['All', 'Draft', 'Sent', 'Paid', 'Overdue']

export default function InvoicesClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [tab, setTab] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: rows } = await supabase.from('invoices')
        .select('*, clients(name)').eq('user_id', data.user.id).order('created_at', { ascending: false })
      setInvoices((rows || []).map((r: { id: string; invoice_number: string; clients: { name: string } | null; issue_date: string; due_date: string; total: number; status: string }) => ({
        id: r.id, invoice_number: r.invoice_number, client_name: r.clients?.name ?? 'Unknown',
        issue_date: r.issue_date, due_date: r.due_date, total: Number(r.total), status: r.status,
      })))
      setLoading(false)
    })
  }, [])

  const filtered = tab === 'All' ? invoices : invoices.filter(i => i.status === tab.toLowerCase())

  return (
    <div>
      <OSPageHeader title="Invoices" description="Create, send, and track invoices"
        action={
          <Link href="/os/invoices/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> Create invoice
          </Link>
        }
      />
      <div style={{ padding: 32 }} className="os-page-wrap">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', borderRadius: 8, padding: 4, width: 'fit-content', border: '1px solid rgba(27,42,74,0.08)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '7px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: tab === t ? 600 : 400, background: tab === t ? '#1B2A4A' : 'transparent', color: tab === t ? '#F5F0E6' : '#5A6A7A' }}>
              {t}
            </button>
          ))}
        </div>
        {loading ? <div style={{ color: '#5A6A7A', fontSize: 14 }}>Loading...</div> : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#5A6A7A' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
            <p style={{ marginBottom: 16 }}>No invoices yet.</p>
            <Link href="/os/invoices/new" style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
              Create your first invoice
            </Link>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
            <table className="mobile-card-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F5F0E6' }}>
                  {['Invoice', 'Client', 'Issued', 'Due', 'Total', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                    <td className="td-primary" data-label="" style={{ padding: '12px 16px', fontWeight: 600 }}>
                      <Link href={`/os/invoices/${inv.id}`} style={{ color: '#2D4A7A' }}>{inv.invoice_number}</Link>
                      <span style={{ marginLeft: 8, fontSize: 12, color: '#5A6A7A', fontWeight: 400 }}>{inv.client_name}</span>
                    </td>
                    <td className="td-hide" data-label="Client" style={{ padding: '12px 16px', color: '#5A6A7A' }}>{inv.client_name}</td>
                    <td data-label="Issued" style={{ padding: '12px 16px', color: '#5A6A7A' }}>{new Date(inv.issue_date).toLocaleDateString('en-GB')}</td>
                    <td data-label="Due" style={{ padding: '12px 16px', color: '#5A6A7A' }}>{new Date(inv.due_date).toLocaleDateString('en-GB')}</td>
                    <td data-label="Amount" style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                    <td data-label="Status" style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: `${STATUS_COLORS[inv.status]}20`, color: STATUS_COLORS[inv.status] }}>
                        {inv.status}
                      </span>
                    </td>
                    <td data-label="" style={{ padding: '12px 16px' }}>
                      <Link href={`/os/invoices/${inv.id}`} style={{ fontSize: 12, color: '#D4A84B', fontWeight: 600 }}>View →</Link>
                    </td>
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
