const BRAND = {
  navy: '#1B2A4A',
  gold: '#D4A84B',
  cream: '#F5F0E6',
  siteUrl: 'https://nithdigital.uk',
}

function baseLayout(title: string, bodyContent: string): { html: string; text: string } {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:${BRAND.navy};padding:28px 32px;border-radius:12px 12px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:22px;font-weight:700;color:${BRAND.gold};letter-spacing:-0.5px;">Nith Digital</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:${BRAND.cream};padding:32px;border-radius:0 0 12px 12px;">
            ${bodyContent}
            <hr style="border:none;border-top:1px solid rgba(27,42,74,0.1);margin:28px 0;">
            <p style="font-size:11px;color:#8A9AAA;line-height:1.6;margin:0;">
              Nith Digital · Sanquhar, Dumfries &amp; Galloway<br>
              <a href="mailto:hello@nithdigital.uk" style="color:${BRAND.gold};">hello@nithdigital.uk</a><br>
              <a href="${BRAND.siteUrl}/unsubscribe" style="color:#8A9AAA;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = bodyContent
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { html, text: `${title}\n\n${text}\n\n---\nNith Digital · hello@nithdigital.uk · ${BRAND.siteUrl}` }
}

function btn(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;padding:12px 24px;background:${BRAND.gold};color:${BRAND.navy};border-radius:100px;font-weight:700;font-size:14px;text-decoration:none;margin:8px 0;">${label}</a>`
}

function h1(text: string) {
  return `<h1 style="font-size:26px;font-weight:400;color:${BRAND.navy};margin:0 0 16px;line-height:1.3;">${text}</h1>`
}

function p(text: string) {
  return `<p style="font-size:15px;line-height:1.7;color:#2D3A4A;margin:0 0 14px;">${text}</p>`
}

export type EmailTemplate =
  | 'launchpad_welcome'
  | 'launchpad_incomplete_reminder'
  | 'launchpad_completed'
  | 'bundle_reminder'
  | 'booking_confirmation'
  | 'booking_reminder'
  | 'testimonial_request'
  | 'os_welcome'
  | 'os_trial_ending'

interface TemplateData {
  name?: string
  steps_completed?: number
  total_steps?: number
  promo_code?: string
  service?: string
  date?: string
  time?: string
  submission_link?: string
  invoices_count?: number
  expenses_count?: number
  meet_link?: string | null
}

export function renderEmailTemplate(
  template: EmailTemplate,
  data: TemplateData
): { subject: string; html: string; text: string } {
  const name = data.name || 'there'

  switch (template) {
    case 'launchpad_welcome': {
      const body = `
        ${h1('Welcome to the Nith Digital Launchpad')}
        ${p(`Hi ${name},`)}
        ${p("You've taken the first step towards launching your business in Dumfries &amp; Galloway — great work!")}
        ${p('The Launchpad walks you through 10 essential steps every new business needs to complete. From registering as a sole trader to setting up your digital presence, we\'ve got you covered.')}
        ${p('<strong>Your progress is saved automatically</strong>, so you can work through the checklist at your own pace.')}
        ${btn('Continue your checklist', `${BRAND.siteUrl}/launchpad/checklist`)}
        ${p('Complete all 10 steps and unlock exclusive access to our <strong>Startup Bundle</strong> — including a free website build. 🎉')}
        ${p('If you have any questions, just reply to this email.')}
        ${p('Good luck!')}
      `
      return { subject: 'Welcome to the Nith Digital Launchpad', ...baseLayout('Welcome to the Nith Digital Launchpad', body) }
    }

    case 'launchpad_incomplete_reminder': {
      const completed = data.steps_completed || 0
      const total = data.total_steps || 10
      const remaining = total - completed
      const body = `
        ${h1(`You're ${remaining} step${remaining !== 1 ? 's' : ''} away from launching your business`)}
        ${p(`Hi ${name},`)}
        ${p(`You started the Launchpad checklist a few days ago and you're making great progress — <strong>${completed} of ${total} steps complete</strong>!`)}
        ${p('Don\'t let the momentum stop. Your business launch is just a few steps away.')}
        <div style="background:${BRAND.navy};border-radius:8px;padding:16px 20px;margin:16px 0;">
          <div style="background:${BRAND.gold};height:8px;border-radius:100px;width:${Math.round((completed / total) * 100)}%;"></div>
          <p style="font-size:13px;color:rgba(245,240,230,0.8);margin:8px 0 0;">${completed}/${total} steps complete</p>
        </div>
        ${p('Complete all 10 steps and unlock the <strong>Startup Bundle</strong> — free website build, plus Business OS included.')}
        ${btn('Continue checklist', `${BRAND.siteUrl}/launchpad/checklist`)}
      `
      return { subject: `You're ${remaining} steps away from launching your business`, ...baseLayout('Launchpad Reminder', body) }
    }

    case 'launchpad_completed': {
      const body = `
        ${h1('🎉 Congratulations! Your business launch checklist is complete')}
        ${p(`Hi ${name},`)}
        ${p("You've done it! All 10 steps of the Nith Digital Launchpad are complete. Your business is ready to launch.")}
        ${p('As promised, here\'s your exclusive <strong>Startup Bundle promo code</strong>:')}
        <div style="background:${BRAND.navy};border-radius:12px;padding:24px;text-align:center;margin:20px 0;">
          <p style="font-size:12px;color:rgba(245,240,230,0.6);margin:0 0 8px;letter-spacing:1px;text-transform:uppercase;">Your promo code</p>
          <p style="font-size:32px;font-weight:700;color:${BRAND.gold};margin:0;letter-spacing:4px;font-family:monospace;">${data.promo_code || 'LAUNCH2026'}</p>
        </div>
        ${p('Your Startup Bundle includes:')}
        <ul style="font-size:15px;line-height:1.8;color:#2D3A4A;margin:0 0 14px;">
          <li>Free website build (worth £500)</li>
          <li>3 months Business OS included</li>
          <li>Priority onboarding call</li>
        </ul>
        ${btn('Redeem your bundle', `${BRAND.siteUrl}/launchpad/bundle`)}
        ${p('Your code is valid for 30 days. Book a call if you have any questions.')}
      `
      return { subject: "Congratulations! Your business launch checklist is complete", ...baseLayout('Launchpad Complete', body) }
    }

    case 'bundle_reminder': {
      const body = `
        ${h1('Your Startup Bundle code is waiting')}
        ${p(`Hi ${name},`)}
        ${p('You completed the Launchpad checklist — well done! But your Startup Bundle code hasn\'t been redeemed yet.')}
        <div style="background:${BRAND.navy};border-radius:12px;padding:24px;text-align:center;margin:20px 0;">
          <p style="font-size:12px;color:rgba(245,240,230,0.6);margin:0 0 8px;letter-spacing:1px;text-transform:uppercase;">Your promo code</p>
          <p style="font-size:32px;font-weight:700;color:${BRAND.gold};margin:0;letter-spacing:4px;font-family:monospace;">${data.promo_code || 'LAUNCH2026'}</p>
        </div>
        ${p('The bundle includes a free website build (£500 value) plus 3 months of Business OS. No catch — you earned it by completing the checklist.')}
        ${btn('Redeem bundle now', `${BRAND.siteUrl}/launchpad/bundle`)}
        ${p('Questions? <a href="${BRAND.siteUrl}/book" style="color:${BRAND.gold};">Book a free call</a> and we\'ll walk you through it.')}
      `
      return { subject: 'Your Startup Bundle code is waiting', ...baseLayout('Bundle Reminder', body) }
    }

    case 'booking_confirmation': {
      const body = `
        ${h1('Your consultation is booked')}
        ${p(`Hi ${name},`)}
        ${p("Your free consultation with Nith Digital is confirmed. Here are your booking details:")}
        <div style="background:white;border:1px solid rgba(27,42,74,0.1);border-radius:12px;padding:24px;margin:16px 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:6px 0;font-size:12px;color:#8A9AAA;text-transform:uppercase;letter-spacing:0.5px;">Service</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:${BRAND.navy};">${data.service || 'Consultation'}</td></tr>
            <tr><td style="padding:6px 0;font-size:12px;color:#8A9AAA;text-transform:uppercase;letter-spacing:0.5px;">Date</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:${BRAND.navy};">${data.date || ''}</td></tr>
            <tr><td style="padding:6px 0;font-size:12px;color:#8A9AAA;text-transform:uppercase;letter-spacing:0.5px;">Time</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:${BRAND.navy};">${data.time || ''}</td></tr>
            <tr><td style="padding:6px 0;font-size:12px;color:#8A9AAA;text-transform:uppercase;letter-spacing:0.5px;">Duration</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:${BRAND.navy};">30 minutes</td></tr>
          </table>
        </div>
        ${data.meet_link ? `${btn('Join Google Meet', data.meet_link)}` : ''}
        ${p(`${data.meet_link ? 'Your Google Meet link is above and ' : 'A Google Meet link will be '}sent in your calendar invite. If you need to reschedule, email <a href="mailto:hello@nithdigital.uk" style="color:${BRAND.gold};">hello@nithdigital.uk</a> as soon as possible.`)}
        ${p('See you soon!')}
      `
      return {
        subject: `Your consultation is booked — ${data.date} at ${data.time}`,
        ...baseLayout('Booking Confirmation', body)
      }
    }

    case 'booking_reminder': {
      const body = `
        ${h1('Reminder: Your consultation with Nith Digital is tomorrow')}
        ${p(`Hi ${name},`)}
        ${p(`This is a friendly reminder that your consultation is <strong>tomorrow, ${data.date} at ${data.time}</strong>.`)}
        ${p('To make the most of our 30 minutes, it helps to think about:')}
        <ul style="font-size:15px;line-height:1.8;color:#2D3A4A;margin:0 0 14px;">
          <li>What you want to achieve (a website, a booking system, a dashboard?)</li>
          <li>Your approximate budget</li>
          <li>Any examples of sites or tools you like</li>
        </ul>
        ${p('Need to reschedule? Email <a href="mailto:hello@nithdigital.uk" style="color:${BRAND.gold};">hello@nithdigital.uk</a> as soon as possible.')}
        ${p('Looking forward to speaking with you!')}
      `
      return { subject: 'Reminder: Your consultation with Nith Digital is tomorrow', ...baseLayout('Booking Reminder', body) }
    }

    case 'testimonial_request': {
      const body = `
        ${h1('How was your experience with Nith Digital?')}
        ${p(`Hi ${name},`)}
        ${p("Thank you for working with us — it was a pleasure helping your business.")}
        ${p("If you have a moment, we'd love to hear about your experience. Your feedback helps other local businesses in Dumfries &amp; Galloway find us — and it means the world to a small local business like ours.")}
        ${btn('Leave a quick review', data.submission_link || `${BRAND.siteUrl}/testimonials/submit`)}
        ${p("It only takes 2 minutes — just a few sentences about your project and how it went.")}
        ${p("Thank you in advance, and don't hesitate to get in touch if you need anything else.")}
      `
      return { subject: 'How was your experience with Nith Digital?', ...baseLayout('Testimonial Request', body) }
    }

    case 'os_welcome': {
      const body = `
        ${h1('Welcome to the Nith Digital Business OS')}
        ${p(`Hi ${name},`)}
        ${p("Your Business OS account is ready. Here's a quick start guide to get you up and running:")}
        <ol style="font-size:15px;line-height:1.8;color:#2D3A4A;margin:0 0 14px;">
          <li><strong>Add your first client</strong> — go to Clients &gt; New client</li>
          <li><strong>Send your first invoice</strong> — go to Invoices &gt; New invoice</li>
          <li><strong>Log your expenses</strong> — keep receipts recorded from day one</li>
          <li><strong>Check the Tax Estimator</strong> — know your tax liability at any time</li>
        </ol>
        ${btn('Open Business OS', `${BRAND.siteUrl}/os`)}
        ${p('Questions? Just reply to this email — we\'re happy to help.')}
      `
      return { subject: 'Welcome to the Nith Digital Business OS', ...baseLayout('Welcome to Business OS', body) }
    }

    case 'os_trial_ending': {
      const body = `
        ${h1('Your free Business OS trial ends in 3 days')}
        ${p(`Hi ${name},`)}
        ${p("Your free Business OS trial (included with the Startup Bundle) is ending soon.")}
        ${p(`Here's what you've accomplished during the trial:`)}
        <div style="background:white;border:1px solid rgba(27,42,74,0.1);border-radius:12px;padding:20px;margin:16px 0;">
          <p style="margin:6px 0;font-size:14px;color:${BRAND.navy};"><strong>${data.invoices_count || 0}</strong> invoices created</p>
          <p style="margin:6px 0;font-size:14px;color:${BRAND.navy};"><strong>${data.expenses_count || 0}</strong> expenses logged</p>
        </div>
        ${p('To keep access, subscribe for just <strong>£4.99/month</strong> — less than a coffee a week to keep your business finances organised.')}
        ${btn('Continue with Business OS', `${BRAND.siteUrl}/os/settings`)}
        ${p("If you don't subscribe, your data will be retained for 30 days.")}
      `
      return { subject: 'Your free Business OS trial ends in 3 days', ...baseLayout('Trial Ending', body) }
    }

    default:
      return { subject: 'Message from Nith Digital', ...baseLayout('Nith Digital', p('Hello!')) }
  }
}
