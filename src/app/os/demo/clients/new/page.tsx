'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OSPageHeader from '@/components/OSPageHeader'
import { useDemo } from '@/lib/demo-context'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

export default function DemoNewClientPage() {
  const router = useRouter()
  const { updateData } = useDemo()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address_line1: '', city: '', postcode: '', notes: '' })

  const save = () => {
    if (!form.name.trim()) return
    const newClient = {
      id: `demo-new-${Date.now()}`,
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      address_line1: form.address_line1 || null,
      city: form.city || null,
      postcode: form.postcode || null,
      tags: [],
      notes: form.notes || null,
      created_at: new Date().toISOString(),
    }
    updateData(prev => ({ ...prev, clients: [...prev.clients, newClient] }))
    router.push('/os/demo/clients')
  }

  return (
    <div>
      <OSPageHeader title="Add Client" />
      <div style={{ padding: 32, maxWidth: 560 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Business / client name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g. Smith Plumbing" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} type="email" />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Address</label>
              <input value={form.address_line1} onChange={e => setForm({ ...form, address_line1: e.target.value })} style={inputStyle} placeholder="Street address" />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Postcode</label>
              <input value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Save client (demo)
            </button>
            <Link href="/os/demo/clients" style={{ padding: '10px 20px', background: '#F5F0E6', color: '#5A6A7A', borderRadius: 100, fontSize: 13, border: 'none' }}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
