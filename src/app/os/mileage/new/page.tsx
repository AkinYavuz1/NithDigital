'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import OSPageHeader from '@/components/OSPageHeader'
import Link from 'next/link'
import { formatCurrency } from '@/lib/taxCalc'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

export default function NewMileagePage() {
  const router = useRouter()
  const [totalMiles, setTotalMiles] = useState(0)
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], from_location: '', to_location: '', miles: '', purpose: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const taxYearStart = new Date().getMonth() >= 3 ? new Date(new Date().getFullYear(), 3, 6) : new Date(new Date().getFullYear() - 1, 3, 6)
      const { data: logs } = await supabase.from('mileage_logs').select('miles').eq('user_id', data.user.id).gte('date', taxYearStart.toISOString().split('T')[0])
      setTotalMiles((logs || []).reduce((s: number, l: { miles: number }) => s + Number(l.miles), 0))
    })
  }, [])

  const miles = parseFloat(form.miles) || 0
  const newTotal = totalMiles + miles
  const rate = newTotal <= 10000 ? 0.45 : 0.25
  const claim = miles * rate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('mileage_logs').insert([{ ...form, miles: parseFloat(form.miles), rate_per_mile: rate, user_id: user.id }])
    router.push('/os/mileage')
  }

  return (
    <div>
      <OSPageHeader title="Add Journey" />
      <div style={{ padding: 32, maxWidth: 560 }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={labelStyle}>Date</label><input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
            <div>
              <label style={labelStyle}>Miles</label>
              <input type="number" required step="0.1" min="0" value={form.miles} onChange={e => setForm({ ...form, miles: e.target.value })} placeholder="0.0" style={inputStyle} />
            </div>
          </div>
          <div><label style={labelStyle}>From</label><input required value={form.from_location} onChange={e => setForm({ ...form, from_location: e.target.value })} placeholder="e.g. Sanquhar" style={inputStyle} /></div>
          <div><label style={labelStyle}>To</label><input required value={form.to_location} onChange={e => setForm({ ...form, to_location: e.target.value })} placeholder="e.g. Dumfries" style={inputStyle} /></div>
          <div><label style={labelStyle}>Purpose</label><input required value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Client meeting" style={inputStyle} /></div>

          {miles > 0 && (
            <div style={{ background: '#F5F0E6', borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: '#5A6A7A' }}>Rate: <strong>{(rate * 100).toFixed(0)}p/mile</strong> {totalMiles < 10000 && newTotal > 10000 && '(mixed rate)'}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1B2A4A' }}>Claim: {formatCurrency(claim)}</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Add journey'}
            </button>
            <Link href="/os/mileage" style={{ padding: '10px 24px', background: 'transparent', color: '#5A6A7A', borderRadius: 100, fontSize: 13, border: '1px solid rgba(27,42,74,0.1)' }}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
