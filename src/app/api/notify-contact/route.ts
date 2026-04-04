import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const serviceLabels: Record<string, string> = {
  website: 'Business website',
  ecommerce: 'E-commerce website',
  booking: 'Booking system',
  dashboard: 'BI dashboard',
  app: 'Custom web app',
  mvp: 'MVP / prototype',
  other: 'Something else',
}

const budgetLabels: Record<string, string> = {
  under500: 'Under £500',
  '500-2000': '£500 – £2,000',
  '2000-5000': '£2,000 – £5,000',
  '5000+': '£5,000+',
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, service, budget, message } = body

  const { error } = await resend.emails.send({
    from: 'Nith Digital <hello@nithdigital.uk>',
    to: 'nithdigital@outlook.com',
    replyTo: email,
    subject: `New enquiry from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1B2A4A">
        <h2 style="margin-bottom:4px">New contact form submission</h2>
        <p style="color:#5A6A7A;margin-top:0">nithdigital.uk/contact</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#5A6A7A;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#5A6A7A">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#D4A84B">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#5A6A7A">Phone</td><td style="padding:8px 0">${phone}</td></tr>` : ''}
          ${service ? `<tr><td style="padding:8px 0;color:#5A6A7A">Service</td><td style="padding:8px 0">${serviceLabels[service] ?? service}</td></tr>` : ''}
          ${budget ? `<tr><td style="padding:8px 0;color:#5A6A7A">Budget</td><td style="padding:8px 0">${budgetLabels[budget] ?? budget}</td></tr>` : ''}
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
        <p style="color:#5A6A7A;margin-bottom:4px;font-size:13px">MESSAGE</p>
        <p style="white-space:pre-wrap;margin-top:4px">${message}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
        <p style="font-size:12px;color:#aaa">Reply to this email to respond directly to ${name}.</p>
      </div>
    `,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
