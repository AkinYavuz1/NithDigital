'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import OSPageHeader from '@/components/OSPageHeader'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8,
  fontFamily: 'inherit', fontSize: 14, outline: 'none', color: '#1B2A4A',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px',
}

const CATEGORIES = [
  { value: 'office_supplies', label: 'Office supplies & stationery' },
  { value: 'travel', label: 'Travel & accommodation' },
  { value: 'fuel', label: 'Fuel & vehicle costs' },
  { value: 'phone_internet', label: 'Phone, internet & broadband' },
  { value: 'software', label: 'Software & subscriptions' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'marketing', label: 'Marketing & advertising' },
  { value: 'professional_fees', label: 'Professional fees (accountant, legal)' },
  { value: 'bank_charges', label: 'Bank charges' },
  { value: 'equipment', label: 'Equipment & tools' },
  { value: 'training', label: 'Training & development' },
  { value: 'meals_entertainment', label: 'Meals & entertainment' },
  { value: 'postage', label: 'Postage & delivery' },
  { value: 'clothing_uniform', label: 'Clothing & uniforms' },
  { value: 'repairs_maintenance', label: 'Repairs & maintenance' },
  { value: 'other', label: 'Other' },
]

export default function ExpenseForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'office_supplies',
    description: '',
    amount: '',
    is_allowable: true,
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('expenses').insert([{ ...form, amount: parseFloat(form.amount), user_id: user.id }])
    router.push('/os/expenses')
  }

  return (
    <div>
      <OSPageHeader title="Add Expense" />
      <div style={{ padding: 32, maxWidth: 560 }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Amount (£)</label>
              <input type="number" required step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Description *</label>
            <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What was this for?" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="checkbox" id="allowable" checked={form.is_allowable} onChange={e => setForm({ ...form, is_allowable: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="allowable" style={{ fontSize: 14, color: '#1B2A4A', cursor: 'pointer' }}>Allowable expense (deductible from tax)</label>
          </div>
          <div style={{ fontSize: 11, color: '#5A6A7A', background: '#F5F0E6', padding: '8px 12px', borderRadius: 6 }}>
            💡 Allowable expenses are costs wholly and exclusively for business purposes. They reduce your taxable profit.
          </div>
          <div>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} />
          </div>
          <div style={{ fontSize: 12, color: '#5A6A7A', background: '#F5F0E6', padding: '10px 14px', borderRadius: 6 }}>
            📎 Receipt image storage coming soon
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Add expense'}
            </button>
            <Link href="/os/expenses" style={{ padding: '10px 24px', background: 'transparent', color: '#5A6A7A', borderRadius: 100, fontSize: 13, border: '1px solid rgba(27,42,74,0.1)' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
