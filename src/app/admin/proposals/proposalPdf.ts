interface ProposalData {
  id: string
  business_name: string
  contact_name: string | null
  contact_email: string | null
  business_type: string
  selected_services: string[]
  custom_bullets: string[]
  pricing_model: string
  estimated_price_low: number | null
  estimated_price_high: number | null
  monthly_cost: number | null
  notes: string | null
  demo_url: string | null
  public_token: string
  created_at: string
}

const NAVY = [27, 42, 74] as const
const GOLD = [212, 168, 75] as const
const CREAM = [245, 240, 230] as const
const LIGHT_GRAY = [90, 106, 122] as const

export async function generateProposalPDF(proposal: ProposalData) {
  const { jsPDF } = await import('jspdf')
  const QRCode = await import('qrcode')
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  const W = 210
  let y = 0

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, 36, 'F')

  // Gold square logo placeholder
  doc.setFillColor(...GOLD)
  doc.roundedRect(12, 8, 20, 20, 2, 2, 'F')
  doc.setTextColor(27, 42, 74)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('N', 22, 22, { align: 'center' })

  // Nith Digital name
  doc.setTextColor(...GOLD)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Nith Digital', 36, 17)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...CREAM)
  doc.text('Web Design & Digital Solutions', 36, 24)

  // Contact info top right
  doc.setTextColor(...CREAM)
  doc.setFontSize(8)
  doc.text(['nithdigital.uk', 'hello@nithdigital.uk', 'Sanquhar, DG4'], W - 12, 12, { align: 'right' })

  y = 46

  // ── Prepared For ──────────────────────────────────────────────────────────
  doc.setTextColor(...NAVY)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Prepared for', 14, y)
  y += 7

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text(proposal.business_name, 14, y)
  y += 7

  if (proposal.contact_name || proposal.contact_email) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...LIGHT_GRAY)
    const contactLine = [proposal.contact_name, proposal.contact_email].filter(Boolean).join(' · ')
    doc.text(contactLine, 14, y)
    y += 6
  }

  // Date + Ref right-aligned
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const refNum = `ND-${proposal.id.slice(-6).toUpperCase()}`
  doc.setFontSize(9)
  doc.setTextColor(...LIGHT_GRAY)
  doc.text(`Date: ${today}`, W - 14, 50, { align: 'right' })
  doc.text(`Ref: ${refNum}`, W - 14, 57, { align: 'right' })

  y += 8

  // Separator line
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.5)
  doc.line(14, y, W - 14, y)
  y += 10

  // ── What We'd Build ───────────────────────────────────────────────────────
  // Gold left bar
  doc.setFillColor(...GOLD)
  doc.rect(14, y, 3, 6, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text("What we'd build for you", 20, y + 5)
  y += 14

  const allBullets = [...proposal.selected_services, ...proposal.custom_bullets]
  if (allBullets.length === 0) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...LIGHT_GRAY)
    doc.text('To be confirmed', 18, y)
    y += 7
  } else {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    for (const bullet of allBullets) {
      if (y > 250) { doc.addPage(); y = 20 }
      doc.setFillColor(...GOLD)
      doc.circle(17, y - 1.5, 1.2, 'F')
      doc.setTextColor(...NAVY)
      const lines = doc.splitTextToSize(bullet, W - 40)
      doc.text(lines, 21, y)
      y += lines.length * 5.5 + 1
    }
  }

  y += 6

  // ── Pricing ───────────────────────────────────────────────────────────────
  if (y > 220) { doc.addPage(); y = 20 }

  doc.setFillColor(...GOLD)
  doc.rect(14, y, 3, 6, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NAVY)
  doc.text('Investment', 20, y + 5)
  y += 14

  if (proposal.pricing_model === 'startup') {
    // Startup bundle table
    const rows = [
      ['Website design & build', '£0 upfront', '£40/month'],
      ['', '(12-month min)', '£30/month after'],
      ['Business OS', '1 month free', '£4.99/month'],
    ]
    doc.setFontSize(9)
    const colX = [18, 100, 155]
    doc.setFillColor(245, 240, 230)
    doc.rect(14, y - 4, W - 28, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    ;['Item', 'Upfront', 'Monthly'].forEach((h, i) => doc.text(h, colX[i], y))
    y += 6
    doc.setFont('helvetica', 'normal')
    for (const row of rows) {
      doc.setDrawColor(245, 240, 230)
      doc.line(14, y - 3, W - 14, y - 3)
      row.forEach((cell, i) => {
        doc.setFont('helvetica', i === 0 ? 'normal' : 'bold')
        doc.setTextColor(i === 0 ? LIGHT_GRAY[0] : NAVY[0], i === 0 ? LIGHT_GRAY[1] : NAVY[1], i === 0 ? LIGHT_GRAY[2] : NAVY[2])
        if (cell) doc.text(cell, colX[i], y)
      })
      y += 6
    }
    y += 4
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...LIGHT_GRAY)
    doc.text('Startup Bundle — No big upfront cost. Just an affordable monthly fee.', 18, y)
    y += 8
  } else if (proposal.pricing_model === 'standard' && (proposal.estimated_price_low || proposal.estimated_price_high || proposal.monthly_cost)) {
    const priceLines: string[] = []
    if (proposal.estimated_price_low && proposal.estimated_price_high) {
      priceLines.push(`One-off build cost: £${proposal.estimated_price_low.toLocaleString('en-GB')} – £${proposal.estimated_price_high.toLocaleString('en-GB')}`)
    } else if (proposal.estimated_price_low) {
      priceLines.push(`One-off build cost: from £${proposal.estimated_price_low.toLocaleString('en-GB')}`)
    }
    if (proposal.monthly_cost) {
      priceLines.push(`Monthly (hosting & support): £${proposal.monthly_cost.toLocaleString('en-GB')}/month`)
    }
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...NAVY)
    for (const line of priceLines) {
      doc.setFillColor(245, 240, 230)
      doc.roundedRect(14, y - 5, W - 28, 10, 2, 2, 'F')
      doc.text(line, 18, y + 0.5)
      y += 14
    }
  } else if (proposal.pricing_model === 'custom' && proposal.notes) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...NAVY)
    const lines = doc.splitTextToSize(proposal.notes, W - 32)
    doc.text(lines, 18, y)
    y += lines.length * 5.5 + 6
  }

  // ── Personal Note ─────────────────────────────────────────────────────────
  if (proposal.notes && proposal.pricing_model !== 'custom') {
    if (y > 230) { doc.addPage(); y = 20 }
    y += 2
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.5)
    doc.line(14, y, W - 14, y)
    y += 8

    doc.setFillColor(...GOLD)
    doc.rect(14, y, 3, 6, 'F')
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('A note from Akin', 20, y + 5)
    y += 12

    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...LIGHT_GRAY)
    const noteLines = doc.splitTextToSize(`"${proposal.notes}"`, W - 32)
    doc.text(noteLines, 18, y)
    y += noteLines.length * 5.5 + 8
  }

  // ── Demo URL + QR ─────────────────────────────────────────────────────────
  if (proposal.demo_url) {
    if (y > 210) { doc.addPage(); y = 20 }
    doc.setFillColor(...GOLD)
    doc.rect(14, y, 3, 6, 'F')
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...NAVY)
    doc.text('See a live preview', 20, y + 5)
    y += 12

    const demoUrl = proposal.demo_url.startsWith('http') ? proposal.demo_url : `https://${proposal.demo_url}`
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...NAVY)
    doc.textWithLink(demoUrl, 18, y, { url: demoUrl })
    y += 8

    try {
      const demoQR = await QRCode.toDataURL(demoUrl, { width: 80, margin: 1 })
      doc.addImage(demoQR, 'PNG', 18, y, 28, 28)
      y += 34
    } catch { y += 4 }
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let pg = 1; pg <= pageCount; pg++) {
    doc.setPage(pg)
    const footerY = 287

    doc.setFillColor(...NAVY)
    doc.rect(0, footerY - 8, W, 20, 'F')

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...CREAM)
    doc.text('Book a free consultation: nithdigital.uk/book', 14, footerY)
    doc.setTextColor(...LIGHT_GRAY)
    doc.text('This proposal is valid for 30 days · Nith Digital · nithdigital.uk', 14, footerY + 5)

    // Booking QR code on first page footer
    if (pg === pageCount) {
      try {
        const bookQR = await QRCode.toDataURL('https://nithdigital.uk/book', { width: 48, margin: 1 })
        doc.addImage(bookQR, 'PNG', W - 30, footerY - 12, 18, 18)
      } catch { /* skip */ }
    }
  }

  doc.save(`Nith-Digital-Proposal-${proposal.business_name.replace(/[^a-z0-9]/gi, '-')}.pdf`)
}
