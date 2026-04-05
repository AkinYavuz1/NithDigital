'use client'

import Link from 'next/link'
import { Plus, Check, X } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { formatCurrency } from '@/lib/taxCalc'
import { useDemo } from '@/lib/demo-context'

const CATEGORY_LABELS: Record<string, string> = {
  office_supplies: 'Office supplies', travel: 'Travel & accommodation', fuel: 'Fuel & vehicle',
  phone_internet: 'Phone & internet', software: 'Software & subscriptions', insurance: 'Insurance',
  marketing: 'Marketing & advertising', professional_fees: 'Professional fees', bank_charges: 'Bank charges',
  equipment: 'Equipment & tools', training: 'Training & development', meals_entertainment: 'Meals & entertainment',
  postage: 'Postage & delivery', clothing_uniform: 'Clothing & uniforms', repairs_maintenance: 'Repairs & maintenance', other: 'Other',
}

export default function DemoExpensesPage() {
  const { data } = useDemo()
  const expenses = data.expenses

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const allowable = expenses.filter(e => e.is_allowable).reduce((s, e) => s + e.amount, 0)

  return (
    <div>
      <OSPageHeader title="Expenses" description="Track your business expenses for tax"
        action={
          <Link href="/os/demo/expenses/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> Add expense
          </Link>
        }
      />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total expenses', value: formatCurrency(total) },
            { label: 'Allowable expenses', value: formatCurrency(allowable) },
            { label: 'Non-allowable', value: formatCurrency(total - allowable) },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#fff', borderRadius: 8, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#5A6A7A', marginBottom: 6, fontWeight: 500 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A' }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 520 }}>
            <thead>
              <tr style={{ background: '#F5F0E6' }}>
                {['Date', 'Category', 'Description', 'Amount', 'Allowable'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '12px 16px', color: '#5A6A7A' }}>{new Date(exp.date).toLocaleDateString('en-GB')}</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 11, padding: '2px 8px', background: '#F5F0E6', borderRadius: 100, color: '#1B2A4A' }}>{CATEGORY_LABELS[exp.category] || exp.category}</span></td>
                  <td style={{ padding: '12px 16px' }}>{exp.description}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatCurrency(exp.amount)}</td>
                  <td style={{ padding: '12px 16px' }}>{exp.is_allowable ? <Check size={16} color="#10B981" /> : <X size={16} color="#EF4444" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}
