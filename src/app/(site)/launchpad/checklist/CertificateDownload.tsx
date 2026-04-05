'use client'

import { useState } from 'react'

export default function CertificateDownload({ promoCode }: { promoCode: string }) {
  const [downloading, setDownloading] = useState(false)

  const downloadCert = async () => {
    setDownloading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      const W = 297
      const H = 210

      // Navy background band
      doc.setFillColor(27, 42, 74)
      doc.rect(0, 0, W, 40, 'F')
      doc.rect(0, H - 25, W, 25, 'F')

      // Gold accent line
      doc.setFillColor(212, 168, 75)
      doc.rect(0, 40, W, 3, 'F')

      // Nith Digital header
      doc.setTextColor(212, 168, 75)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('NITH DIGITAL', W / 2, 24, { align: 'center' })

      // Cream cream body
      doc.setFillColor(245, 240, 230)
      doc.rect(0, 43, W, H - 68, 'F')

      // Title
      doc.setTextColor(27, 42, 74)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'normal')
      doc.text('CERTIFICATE OF COMPLETION', W / 2, 62, { align: 'center' })

      doc.setFontSize(28)
      doc.setFont('times', 'bold')
      doc.text('Business Launch Certificate', W / 2, 82, { align: 'center' })

      doc.setFontSize(13)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(90, 106, 122)
      doc.text('This certifies that', W / 2, 96, { align: 'center' })

      doc.setFontSize(20)
      doc.setFont('times', 'italic')
      doc.setTextColor(27, 42, 74)
      doc.text('a new Scottish sole trader', W / 2, 110, { align: 'center' })

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(90, 106, 122)
      doc.text('has completed all 10 startup essentials of the Nith Digital Launchpad', W / 2, 124, { align: 'center' })

      // Date and cert number
      const certNum = `ND-${Date.now().toString(36).toUpperCase()}`
      const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

      doc.setFontSize(11)
      doc.setTextColor(27, 42, 74)
      doc.text(`Date: ${date}`, W / 2 - 40, 140, { align: 'center' })
      doc.text(`Certificate No: ${certNum}`, W / 2 + 40, 140, { align: 'center' })

      // Promo code box
      doc.setFillColor(212, 168, 75)
      doc.roundedRect(W / 2 - 50, 148, 100, 20, 3, 3, 'F')
      doc.setTextColor(27, 42, 74)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Startup Bundle Code:', W / 2, 155.5, { align: 'center' })
      doc.setFontSize(12)
      doc.text(promoCode, W / 2, 163, { align: 'center' })

      // Footer
      doc.setTextColor(245, 240, 230)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('nithdigital.uk  ·  hello@nithdigital.uk  ·  Sanquhar, Dumfries & Galloway', W / 2, H - 9, { align: 'center' })

      doc.save('nith-digital-launch-certificate.pdf')
    } catch (err) {
      console.error('PDF generation failed:', err)
    }
    setDownloading(false)
  }

  return (
    <div
      style={{
        background: '#F5F0E6',
        border: '1px solid rgba(27,42,74,0.1)',
        borderRadius: 12,
        padding: 32,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, color: '#1B2A4A', marginBottom: 8 }}>
        Download your Business Launch Certificate
      </h3>
      <p style={{ fontSize: 13, color: '#5A6A7A', marginBottom: 20, maxWidth: 360, margin: '0 auto 20px' }}>
        A branded PDF certificate to mark your launch milestone. Includes your promo code.
      </p>
      <button
        onClick={downloadCert}
        disabled={downloading}
        style={{
          padding: '12px 28px',
          background: '#1B2A4A',
          color: '#F5F0E6',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.25s ease',
        }}
      >
        {downloading ? 'Generating PDF...' : 'Download Certificate (PDF)'}
      </button>
    </div>
  )
}
