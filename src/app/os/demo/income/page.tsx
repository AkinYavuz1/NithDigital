'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { formatCurrency } from '@/lib/taxCalc'
import { useDemo } from '@/lib/demo-context'

export default function DemoIncomePage() {
  const { data } = useDemo()

  // Combine income records + paid invoices (same as real IncomeClient)
  const paidInvoiceRows = data.invoices.filter(i => i.status === 'paid').map(inv => ({
    id: `inv-${inv.id}`, date: inv.issue_date, source: `Invoice ${inv.invoice_number}`,
    description: 'Paid invoice', amount: inv.total, category: 'sales',
  }))
  const records = [...data.income, ...paidInvoiceRows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const total = records.reduce((s, r) => s + r.amount, 0)

  return (
    <div>
      <OSPageHeader title="Income" description="Track all income including paid invoices"
        action={
          <Link href="/os/demo/income/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> Add income
          </Link>
        }
      />
      <div style={{ padding: 32 }}>
        <div style={{ background: '#1B2A4A', borderRadius: 8, padding: '16px 24px', marginBottom: 24, display: 'inline-block' }}>
          <div style={{ fontSize: 11, color: 'rgba(245,240,230,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Total income</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#D4A84B' }}>{formatCurrency(total)}</div>
        </div>
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
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
