'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LineItem {
  id: string
  description: string
  qty: number
  price: number
}

type VATRate = 0 | 5 | 20

export default function InvoiceGeneratorClient() {
  const [biz, setBiz] = useState({ name: '', address: '', email: '' })
  const [client, setClient] = useState({ name: '', address: '' })
  const [invoiceNo, setInvoiceNo] = useState('INV-001')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split('T')[0]
  })
  const [vatRate, setVatRate] = useState<VATRate>(0)
  const [notes, setNotes] = useState('Payment due within 30 days. Bank transfer preferred.')
  const [items, setItems] = useState<LineItem[]>([{ id: '1', description: '', qty: 1, price: 0 }])

  const addItem = () => setItems(prev => [...prev, { id: Date.now().toString(), description: '', qty: 1, price: 0 }])
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const subtotal = items.reduce((s, i) => s + (i.qty * i.price), 0)
  const vat = subtotal * (vatRate / 100)
  const total = subtotal + vat

  const fmt = (n: number) => `£${n.toFixed(2)}`

  const downloadPdf = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const NAVY = [27, 42, 74] as [number, number, number]
    const GOLD = [212, 168, 75] as [number, number, number]
    const CREAM = [245, 240, 230] as [number, number, number]

    // Header
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(...CREAM)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(biz.name || 'Your Business', 15, 20)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    if (biz.address) doc.text(biz.address, 15, 28)
    if (biz.email) doc.text(biz.email, 15, 35)

    // Invoice badge
    doc.setFillColor(...GOLD)
    doc.rect(140, 10, 55, 20, 'F')
    doc.setTextColor(...NAVY)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', 167, 23, { align: 'center' })

    // Invoice details
    doc.setTextColor(45, 74, 122)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    let y = 52
    const right = 195
    doc.setFont('helvetica', 'bold')
    doc.text('Invoice to:', 15, y)
    doc.text('Invoice details:', 110, y)
    doc.setFont('helvetica', 'normal')
    y += 7
    doc.text(client.name || 'Client Name', 15, y)
    doc.text(`Invoice No: ${invoiceNo}`, 110, y)
    y += 6
    if (client.address) {
      client.address.split('\n').forEach((line: string) => {
        doc.text(line, 15, y)
        y += 6
      })
    }
    doc.text(`Date: ${date}`, 110, y - 6)
    doc.text(`Due: ${dueDate}`, 110, y)

    // Line items table
    y = 90
    doc.setFillColor(...NAVY)
    doc.rect(15, y - 5, 180, 9, 'F')
    doc.setTextColor(...CREAM)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Description', 18, y + 1)
    doc.text('Qty', 130, y + 1)
    doc.text('Price', 150, y + 1)
    doc.text('Amount', 175, y + 1, { align: 'right' })

    y += 10
    doc.setTextColor(27, 42, 74)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    items.forEach((item, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(...CREAM)
        doc.rect(15, y - 4, 180, 8, 'F')
      }
      doc.text(item.description || '—', 18, y + 1)
      doc.text(String(item.qty), 130, y + 1)
      doc.text(fmt(item.price), 150, y + 1)
      doc.text(fmt(item.qty * item.price), 195, y + 1, { align: 'right' })
      y += 9
    })

    // Totals
    y += 6
    doc.setFontSize(10)
    if (vatRate > 0) {
      doc.text('Subtotal:', 140, y)
      doc.text(fmt(subtotal), 195, y, { align: 'right' })
      y += 7
      doc.text(`VAT (${vatRate}%):`, 140, y)
      doc.text(fmt(vat), 195, y, { align: 'right' })
      y += 7
    }
    doc.setFillColor(...NAVY)
    doc.rect(130, y - 5, 65, 10, 'F')
    doc.setTextColor(...CREAM)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL:', 135, y + 2)
    doc.text(fmt(total), 193, y + 2, { align: 'right' })

    // Notes
    if (notes) {
      y += 20
      doc.setTextColor(90, 106, 122)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('Notes:', 15, y)
      y += 6
      doc.text(notes, 15, y, { maxWidth: 180 })
    }

    doc.save(`${invoiceNo || 'invoice'}.pdf`)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid rgba(27,42,74,0.15)',
    borderRadius: 8, fontSize: 13, color: '#1B2A4A', fontFamily: 'inherit',
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="inv-layout">
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* From */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16, fontWeight: 400 }}>Your business</h3>
            {[
              { label: 'Business name', key: 'name', placeholder: 'Acme Ltd' },
              { label: 'Address / postcode', key: 'address', placeholder: 'Sanquhar, DG4 6BX' },
              { label: 'Email', key: 'email', placeholder: 'hello@example.com' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{f.label}</label>
                <input style={inputStyle} value={biz[f.key as keyof typeof biz]} onChange={e => setBiz(b => ({ ...b, [f.key]: e.target.value }))} placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          {/* To */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16, fontWeight: 400 }}>Bill to</h3>
            {[
              { label: 'Client name', key: 'name', placeholder: 'Client Ltd' },
              { label: 'Client address', key: 'address', placeholder: 'Edinburgh, EH1 1AB' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{f.label}</label>
                <input style={inputStyle} value={client[f.key as keyof typeof client]} onChange={e => setClient(c => ({ ...c, [f.key]: e.target.value }))} placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          {/* Invoice details */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16, fontWeight: 400 }}>Invoice details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              {[
                { label: 'Invoice No', val: invoiceNo, set: setInvoiceNo, type: 'text' },
                { label: 'Date', val: date, set: setDate, type: 'date' },
                { label: 'Due date', val: dueDate, set: setDueDate, type: 'date' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{f.label}</label>
                  <input type={f.type} style={inputStyle} value={f.val} onChange={e => f.set(e.target.value)} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5A6A7A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>VAT rate</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {([0, 5, 20] as VATRate[]).map(r => (
                  <button key={r} onClick={() => setVatRate(r)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '2px solid', borderColor: vatRate === r ? '#1B2A4A' : 'rgba(27,42,74,0.15)', background: vatRate === r ? '#1B2A4A' : 'white', color: vatRate === r ? '#F5F0E6' : '#5A6A7A', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {r}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          {/* Line items */}
          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16, fontWeight: 400 }}>Line items</h3>
            {items.map(item => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 30px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input style={inputStyle} placeholder="Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                <input type="number" min={1} style={inputStyle} value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} />
                <input type="number" min={0} step={0.01} style={inputStyle} placeholder="Price" value={item.price || ''} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} />
                <button onClick={() => removeItem(item.id)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: 16 }}>×</button>
              </div>
            ))}
            <button onClick={addItem} style={{ padding: '8px 16px', background: 'transparent', border: '1px dashed rgba(27,42,74,0.3)', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: '#5A6A7A', marginTop: 4 }}>
              + Add line
            </button>
          </div>

          {/* Totals */}
          <div style={{ background: '#1B2A4A', borderRadius: 12, padding: 24, color: '#F5F0E6', marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'rgba(245,240,230,0.6)' }}>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {vatRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'rgba(245,240,230,0.6)' }}>VAT ({vatRate}%)</span>
                  <span>{fmt(vat)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 700, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span>Total</span>
                <span style={{ color: '#D4A84B' }}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1B2A4A', marginBottom: 6 }}>Notes / payment terms</label>
            <textarea rows={3} style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <button onClick={downloadPdf}
            style={{ width: '100%', padding: '14px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 16 }}>
            Download PDF →
          </button>

          <div style={{ background: '#F5F0E6', borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.7, margin: 0 }}>
              Want to <strong>save</strong> invoices, track payments, and manage clients?{' '}
              <Link href="/os" style={{ color: '#D4A84B', fontWeight: 600 }}>Try the Business OS</Link> —
              first month free with the <Link href="/launchpad/bundle" style={{ color: '#D4A84B', fontWeight: 600 }}>Startup Bundle</Link>.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .inv-layout { }
        @media (max-width: 768px) { .inv-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
