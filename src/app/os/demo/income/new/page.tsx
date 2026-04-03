'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OSPageHeader from '@/components/OSPageHeader'
import { useDemo } from '@/lib/demo-context'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

export default function DemoNewIncomePage() {
  const router = useRouter()
  const { updateData } = useDemo()
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], source: '', description: '', amount: '', category: 'consultancy' })

  const save = () => {
    if (!form.source || !form.amount) return
    updateData(prev => ({
      ...prev,
      income: [{
        id: `demo-new-inc-${Date.now()}`,
        date: form.date, source: form.source, description: form.description || null,
        amount: parseFloat(form.amount), category: form.category,
      }, ...prev.income],
    }))
    router.push('/os/demo/income')
  }

  return (
    <div>
      <OSPageHeader title="Add Income" />
      <div style={{ padding: 32, maxWidth: 480 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={labelStyle}>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
          <div><label style={labelStyle}>Source</label><input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} style={inputStyle} placeholder="e.g. Power BI training" /></div>
          <div><label style={labelStyle}>Description (optional)</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} /></div>
          <div><label style={labelStyle}>Amount (£)</label><input type="number" min={0} step={0.01} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              <option value="client_project">Client project</option>
              <option value="consultancy">Consultancy</option>
              <option value="training">Training</option>
              <option value="sales">Sales</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save income (demo)</button>
            <Link href="/os/demo/income" style={{ padding: '10px 20px', background: '#F5F0E6', color: '#5A6A7A', borderRadius: 100, fontSize: 13 }}>Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
