'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { formatCurrency } from '@/lib/taxCalc'

interface IncomeRecord { id: string; date: string; source: string; description: string | null; amount: number; category: string }

export default function IncomeClient() {
  const [records, setRecords] = useState<IncomeRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const [{ data: income }, { data: paidInvoices }] = await Promise.all([
        supabase.from('income').select('*').eq('user_id', data.user.id).order('date', { ascending: false }),
        supabase.from('invoices').select('id,invoice_number,issue_date,total').eq('user_id', data.user.id).eq('status', 'paid').order('issue_date', { ascending: false }),
      ])
      const incomeRows = (income || []) as IncomeRecord[]
      const invoiceRows = (paidInvoices || []).map((inv: { id: string; invoice_number: string; issue_date: string; total: number }) => ({
        id: `inv-${inv.id}`, date: inv.issue_date, source: `Invoice ${inv.invoice_number}`,
        description: 'Paid invoice', amount: Number(inv.total), category: 'sales',
      }))
      setRecords([...incomeRows, ...invoiceRows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      setLoading(false)
    })
  }, [])

  const total = records.reduce((s, r) => s + Number(r.amount), 0)

  return (
    <div>
      <OSPageHeader title="Income" description="Track all income including paid invoices"
        action={
          <Link href="/os/income/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> Add income
          </Link>
        }
      />
      <div style={{ padding: 32 }}>
        <div style={{ background: '#1B2A4A', borderRadius: 8, padding: '16px 24px', marginBottom: 24, display: 'inline-block' }}>
          <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Total income</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D4A84B' }}>{formatCurrency(total)}</div>
        </div>
        {loading ? <div style={{ color: '#5A6A7A' }}>Loading...</div> : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#5A6A7A' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📈</div>
            <p style={{ marginBottom: 16 }}>No income yet. Income from paid invoices will appear here automatically.</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F5F0E6' }}>
                  {['Date', 'Source', 'Description', 'Category', 'Amount'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{new Date(r.date).toLocaleDateString('en-GB')}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.source}</td>
                    <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{r.description || '—'}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 11, padding: '2px 8px', background: '#F5F0E6', borderRadius: 100 }}>{r.category}</span></td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(Number(r.amount))}</td>
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
