'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import OSPageHeader from '@/components/OSPageHeader'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8,
  fontFamily: 'inherit', fontSize: 14, outline: 'none', color: '#1B2A4A',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#5A6A7A',
  textTransform: 'uppercase', letterSpacing: '0.5px',
}

interface ClientFormProps { clientId?: string }

export default function ClientForm({ clientId }: ClientFormProps) {
  const router = useRouter()
  const isEdit = !!clientId
  const [form, setForm] = useState({ name: '', email: '', phone: '', address_line1: '', address_line2: '', city: '', postcode: '', notes: '', tagsRaw: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!clientId) return
    const supabase = createClient()
    supabase.from('clients').select('*').eq('id', clientId).single().then(({ data }) => {
      if (data) setForm({ ...data, tagsRaw: (data.tags || []).join(', ') })
    })
  }, [clientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { ...form, tags: form.tagsRaw.split(',').map(t => t.trim()).filter(Boolean), user_id: user.id }
    delete (payload as Record<string, unknown>).tagsRaw
    if (isEdit) {
      await supabase.from('clients').update(payload).eq('id', clientId)
    } else {
      await supabase.from('clients').insert([payload])
    }
    router.push('/os/clients')
  }

  return (
    <div>
      <OSPageHeader title={isEdit ? 'Edit Client' : 'Add Client'} />
      <div style={{ padding: 32, maxWidth: 600 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address line 1</label>
              <input value={form.address_line1} onChange={e => setForm({ ...form, address_line1: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address line 2</label>
              <input value={form.address_line2} onChange={e => setForm({ ...form, address_line2: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Postcode</label>
              <input value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input value={form.tagsRaw} onChange={e => setForm({ ...form, tagsRaw: e.target.value })} placeholder="e.g. plumber, regular, vip" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add client'}
            </button>
            <Link href="/os/clients" style={{ padding: '10px 24px', background: 'transparent', color: '#5A6A7A', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1px solid rgba(27,42,74,0.15)' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
