'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OSPageHeader from '@/components/OSPageHeader'
import { useDemo } from '@/lib/demo-context'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

const CATEGORIES = [
  { value: 'office_supplies', label: 'Office supplies' }, { value: 'travel', label: 'Travel & accommodation' },
  { value: 'fuel', label: 'Fuel & vehicle' }, { value: 'phone_internet', label: 'Phone & internet' },
  { value: 'software', label: 'Software & subscriptions' }, { value: 'insurance', label: 'Insurance' },
  { value: 'marketing', label: 'Marketing & advertising' }, { value: 'professional_fees', label: 'Professional fees' },
  { value: 'bank_charges', label: 'Bank charges' }, { value: 'equipment', label: 'Equipment & tools' },
  { value: 'training', label: 'Training & development' }, { value: 'meals_entertainment', label: 'Meals & entertainment' },
  { value: 'postage', label: 'Postage & delivery' }, { value: 'other', label: 'Other' },
]

export default function DemoNewExpensePage() {
  const router = useRouter()
  const { updateData } = useDemo()
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], category: 'software', description: '', amount: '', is_allowable: true })

  const save = () => {
    if (!form.description || !form.amount) return
    updateData(prev => ({
      ...prev,
      expenses: [{
        id: `demo-new-e-${Date.now()}`,
        date: form.date, category: form.category, description: form.description,
        amount: parseFloat(form.amount), is_allowable: form.is_allowable, receipt_url: null,
      }, ...prev.expenses],
    }))
    router.push('/os/demo/expenses')
  }

  return (
    <div>
      <OSPageHeader title="Add Expense" />
      <div style={{ padding: 32, maxWidth: 480 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={labelStyle}>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} placeholder="e.g. Cloudflare Pro — April" /></div>
          <div><label style={labelStyle}>Amount (£)</label><input type="number" min={0} step={0.01} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" style={inputStyle} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="allowable" checked={form.is_allowable} onChange={e => setForm({ ...form, is_allowable: e.target.checked })} style={{ width: 16, height: 16 }} />
            <label htmlFor="allowable" style={{ fontSize: 13, color: '#1B2A4A' }}>Allowable for tax</label>
          </div>
          <div style={{ fontSize: 12, color: '#5A6A7A', background: '#F5F0E6', borderRadius: 6, padding: '8px 12px' }}>
            File uploads are available with a free account.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save expense (demo)</button>
            <Link href="/os/demo/expenses" style={{ padding: '10px 20px', background: '#F5F0E6', color: '#5A6A7A', borderRadius: 100, fontSize: 13 }}>Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
