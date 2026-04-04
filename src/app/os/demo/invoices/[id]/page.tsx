'use client'

export const dynamic = 'force-static'

import { use } from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { formatCurrency } from '@/lib/taxCalc'
import { useDemo } from '@/lib/demo-context'
import { demoClients } from '@/lib/demo-data'

const STATUS_COLORS: Record<string, string> = {
  draft: '#9CA3AF', sent: '#3B82F6', paid: '#10B981', overdue: '#EF4444', cancelled: '#6B7280',
}

export default function DemoInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, updateData } = useDemo()

  const inv = data.invoices.find(i => i.id === id)
  if (!inv) return <div style={{ padding: 32, color: '#5A6A7A' }}>Invoice not found.</div>

  const client = demoClients.find(c => c.id === inv.client_id)

  const updateStatus = (status: string) => {
    updateData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => i.id === id ? { ...i, status } : i),
    }))
  }

  const downloadPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()
    const W = 210

    doc.setFillColor(27, 42, 74)
    doc.rect(0, 0, W, 40, 'F')
    doc.setTextColor(212, 168, 75)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('NITH DIGITAL', 14, 20)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(245, 240, 230)
    doc.text(['hello@nithdigital.uk', 'Sanquhar, DG4, Scotland'].join('\n'), 14, 28)
    doc.setTextColor(212, 168, 75)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', W - 14, 24, { align: 'right' })

    doc.setTextColor(27, 42, 74)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    ;[
      [`Invoice: ${inv.invoice_number}`, `Status: ${inv.status.toUpperCase()}`],
      [`Issue date: ${new Date(inv.issue_date).toLocaleDateString('en-GB')}`, `Due date: ${new Date(inv.due_date).toLocaleDateString('en-GB')}`],
    ].forEach((row, i) => {
      doc.text(row[0], 14, 52 + i * 8)
      doc.text(row[1], W - 14, 52 + i * 8, { align: 'right' })
    })

    if (client) {
      doc.setFillColor(245, 240, 230)
      doc.rect(14, 72, 80, 24, 'F')
      doc.setFontSize(9)
      doc.setTextColor(90, 106, 122)
      doc.text('BILL TO', 17, 78)
      doc.setTextColor(27, 42, 74)
      doc.setFont('helvetica', 'bold')
      doc.text(client.name, 17, 85)
      doc.setFont('helvetica', 'normal')
      const addr = [client.address_line1, client.city, client.postcode].filter(Boolean).join(', ')
      if (addr) doc.text(addr, 17, 91)
    }

    autoTable(doc, {
      startY: 102,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: inv.items.map(item => [item.description, item.quantity.toString(), formatCurrency(item.unit_price), formatCurrency(item.total)]),
      headStyles: { fillColor: [27, 42, 74], textColor: [245, 240, 230], fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 90 }, 1: { halign: 'right', cellWidth: 20 }, 2: { halign: 'right', cellWidth: 35 }, 3: { halign: 'right', cellWidth: 35 } },
      styles: { fontSize: 10 },
    })

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
    doc.setFontSize(10)
    doc.text('Subtotal:', W - 60, finalY)
    doc.text(formatCurrency(inv.subtotal), W - 14, finalY, { align: 'right' })
    doc.text(`VAT (${inv.vat_rate}%):`, W - 60, finalY + 7)
    doc.text(formatCurrency(inv.vat_amount), W - 14, finalY + 7, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('TOTAL:', W - 60, finalY + 16)
    doc.text(formatCurrency(inv.total), W - 14, finalY + 16, { align: 'right' })

    doc.save(`${inv.invoice_number}.pdf`)
  }

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Link href="/os/demo/invoices" style={{ fontSize: 12, color: '#5A6A7A' }}>← Invoices</Link>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#1B2A4A', marginTop: 4 }}>{inv.invoice_number}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: `${STATUS_COLORS[inv.status]}20`, color: STATUS_COLORS[inv.status] }}>{inv.status}</span>
          <button onClick={downloadPDF} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', background: '#1B2A4A', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#F5F0E6', border: 'none', cursor: 'pointer' }}>
            <Download size={12} /> PDF
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(27,42,74,0.08)' }}>
        <div style={{ background: '#1B2A4A', padding: '28px 32px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#D4A84B', fontWeight: 700, marginBottom: 4 }}>NITH DIGITAL</div>
            <div style={{ fontSize: 12, color: 'rgba(245,240,230,0.6)' }}>hello@nithdigital.uk · Sanquhar, DG4</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#F5F0E6', marginBottom: 4 }}>INVOICE</div>
            <div style={{ fontSize: 14, color: '#D4A84B', fontWeight: 600 }}>{inv.invoice_number}</div>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div>
              {client && (
                <div style={{ background: '#F5F0E6', borderRadius: 6, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#5A6A7A', marginBottom: 6, fontWeight: 500 }}>Bill to</div>
                  <div style={{ fontWeight: 600, color: '#1B2A4A' }}>{client.name}</div>
                  {client.email && <div style={{ fontSize: 13, color: '#5A6A7A' }}>{client.email}</div>}
                  {client.city && <div style={{ fontSize: 13, color: '#5A6A7A' }}>{[client.city, client.postcode].filter(Boolean).join(', ')}</div>}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5A6A7A' }}>Issue date</span>
                <span style={{ fontWeight: 500 }}>{new Date(inv.issue_date).toLocaleDateString('en-GB')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5A6A7A' }}>Due date</span>
                <span style={{ fontWeight: 500 }}>{new Date(inv.due_date).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ background: '#F5F0E6' }}>
                {['Description', 'Qty', 'Unit price', 'Total'].map((h, i) => (
                  <th key={h} style={{ textAlign: i > 0 ? 'right' : 'left', padding: '10px 12px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: '#5A6A7A', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inv.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                  <td style={{ padding: '12px', fontSize: 14 }}>{item.description}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#5A6A7A' }}>{item.quantity}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#5A6A7A' }}>{formatCurrency(item.unit_price)}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginBottom: 24 }}>
            {[
              { label: 'Subtotal', value: formatCurrency(inv.subtotal) },
              { label: `VAT (${inv.vat_rate}%)`, value: formatCurrency(inv.vat_amount) },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 32, fontSize: 13 }}>
                <span style={{ color: '#5A6A7A', minWidth: 80 }}>{row.label}</span>
                <span style={{ minWidth: 80, textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 32, fontSize: 16, fontWeight: 700, borderTop: '2px solid #1B2A4A', paddingTop: 8, marginTop: 4 }}>
              <span>Total</span>
              <span style={{ minWidth: 80, textAlign: 'right' }}>{formatCurrency(inv.total)}</span>
            </div>
          </div>

          {inv.payment_terms && (
            <div style={{ fontSize: 12, color: '#5A6A7A', borderTop: '1px solid rgba(27,42,74,0.08)', paddingTop: 16 }}>{inv.payment_terms}</div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
        {inv.status !== 'paid' && (
          <button onClick={() => updateStatus('paid')} style={{ padding: '10px 18px', background: '#10B981', color: '#fff', borderRadius: 100, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Mark as paid
          </button>
        )}
        {inv.status === 'draft' && (
          <button onClick={() => updateStatus('sent')} style={{ padding: '10px 18px', background: '#3B82F6', color: '#fff', borderRadius: 100, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Mark as sent
          </button>
        )}
        <button
          title="Deletion disabled in demo mode"
          onClick={() => alert('Deletion is disabled in demo mode.')}
          style={{ padding: '10px 18px', background: 'transparent', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'not-allowed', opacity: 0.6 }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
