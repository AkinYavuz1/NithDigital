'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import OSPageHeader from '@/components/OSPageHeader'
import Link from 'next/link'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

export default function NewIncomePage() {
  const router = useRouter()
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], source: '', description: '', amount: '', category: 'sales' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('income').insert([{ ...form, amount: parseFloat(form.amount), user_id: user.id }])
    router.push('/os/income')
  }

  return (
    <div>
      <OSPageHeader title="Add Income" />
      <div style={{ padding: 32, maxWidth: 480 }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={labelStyle}>Date</label><input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>Amount (£)</label><input type="number" required step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Source *</label><input required value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="e.g. Client name or income type" style={inputStyle} /></div>
          <div><label style={labelStyle}>Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              <option value="sales">Sales</option>
              <option value="freelance">Freelance</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Add income'}
            </button>
            <Link href="/os/income" style={{ padding: '10px 24px', background: 'transparent', color: '#5A6A7A', borderRadius: 100, fontSize: 13, border: '1px solid rgba(27,42,74,0.1)' }}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
