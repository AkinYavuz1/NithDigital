'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OSPageHeader from '@/components/OSPageHeader'
import { useDemo } from '@/lib/demo-context'

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }

export default function DemoNewMileagePage() {
  const router = useRouter()
  const { updateData } = useDemo()
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], from_location: '', to_location: '', miles: '', purpose: '' })

  const save = () => {
    if (!form.from_location || !form.to_location || !form.miles) return
    const miles = parseFloat(form.miles)
    const rate = 0.45
    updateData(prev => ({
      ...prev,
      mileage: [{
        id: `demo-new-m-${Date.now()}`,
        date: form.date, from_location: form.from_location, to_location: form.to_location,
        miles, purpose: form.purpose, rate_per_mile: rate, total_claim: miles * rate,
      }, ...prev.mileage],
    }))
    router.push('/os/demo/mileage')
  }

  return (
    <div>
      <OSPageHeader title="Add Journey" />
      <div style={{ padding: 32, maxWidth: 480 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={labelStyle}>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
          <div><label style={labelStyle}>From</label><input value={form.from_location} onChange={e => setForm({ ...form, from_location: e.target.value })} style={inputStyle} placeholder="e.g. Sanquhar" /></div>
          <div><label style={labelStyle}>To</label><input value={form.to_location} onChange={e => setForm({ ...form, to_location: e.target.value })} style={inputStyle} placeholder="e.g. Dumfries" /></div>
          <div><label style={labelStyle}>Miles</label><input type="number" min={0} step={0.1} value={form.miles} onChange={e => setForm({ ...form, miles: e.target.value })} placeholder="0.0" style={inputStyle} /></div>
          <div><label style={labelStyle}>Purpose</label><input value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} style={inputStyle} placeholder="e.g. Client meeting" /></div>
          <div style={{ background: '#F5F0E6', borderRadius: 6, padding: '10px 14px', fontSize: 12, color: '#5A6A7A' }}>
            Claim: {form.miles ? `£${(parseFloat(form.miles) * 0.45).toFixed(2)}` : '£0.00'} at HMRC 45p/mile rate
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save journey (demo)</button>
            <Link href="/os/demo/mileage" style={{ padding: '10px 20px', background: '#F5F0E6', color: '#5A6A7A', borderRadius: 100, fontSize: 13 }}>Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
