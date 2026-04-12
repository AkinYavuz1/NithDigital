import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Nith Digital',
  description: 'Terms and conditions for Nith Digital web design, development, and digital services.',
  alternates: { canonical: 'https://nithdigital.uk/terms' },
  openGraph: {
    title: 'Terms & Conditions — Nith Digital',
    description: 'Terms and conditions for Nith Digital web design, development, and digital services.',
    url: 'https://nithdigital.uk/terms',
    siteName: 'Nith Digital',
    locale: 'en_GB',
    type: 'website',
  },
}

const SECTIONS = [
  {
    heading: '1. About these terms',
    body: [
      'These terms and conditions govern the provision of web design, web development, digital marketing, and related services by Nith Digital ("we", "us", "our"), a business operated by Akin Yavuz, based in Sanquhar, Dumfries & Galloway, Scotland.',
      'By engaging our services — whether by accepting a proposal, making a payment, or instructing us to begin work — you agree to these terms.',
      'These terms were last updated on 1 April 2026.',
    ],
  },
  {
    heading: '2. Services',
    body: [
      'The scope of work for each project is defined in the proposal or written brief agreed between us before work begins. Any work outside that scope will be quoted separately and requires written agreement before proceeding.',
      'We reserve the right to decline any project or request that conflicts with our values or legal obligations.',
    ],
  },
  {
    heading: '3. Quotes and pricing',
    body: [
      'All quotes are valid for 30 days from the date issued unless otherwise stated. Prices are in GBP and exclusive of VAT where applicable.',
      'We reserve the right to revise pricing if the project scope materially changes after a quote has been accepted.',
    ],
  },
  {
    heading: '4. Payment terms',
    body: [
      'A non-refundable deposit of 50% is required before any work commences. The remaining balance is due on completion, prior to final delivery or go-live.',
      'For ongoing retainer services (SEO, maintenance, hosting), payment is due monthly in advance by the date specified on the invoice.',
      'Invoices are due within 14 days of issue unless otherwise agreed in writing. Late payments may incur interest at 8% above the Bank of England base rate under the Late Payment of Commercial Debts (Interest) Act 1998.',
      'We reserve the right to pause or withhold delivery of work until outstanding invoices are settled.',
    ],
  },
  {
    heading: '5. Client responsibilities',
    body: [
      'You are responsible for providing all required content (text, images, logos, brand assets) within the timescale agreed. Delays caused by late content supply may result in revised delivery dates or additional charges.',
      'You warrant that any content you provide does not infringe third-party intellectual property rights, is accurate, and complies with applicable law.',
      'You are responsible for obtaining any licences, permissions, or regulatory approvals required for your business or website content (e.g. healthcare regulations, GDPR compliance for your own data collection).',
    ],
  },
  {
    heading: '6. Revisions',
    body: [
      'Each project includes a reasonable number of revisions as specified in the proposal. Revisions are defined as minor amendments to agreed designs or content — not changes to scope or direction.',
      'Substantial changes in direction after approval of a design stage will be treated as new scope and quoted accordingly.',
    ],
  },
  {
    heading: '7. Intellectual property',
    body: [
      'On receipt of final payment, ownership of the completed website design and custom code transfers to you. We retain the right to display the work in our portfolio unless you request otherwise in writing.',
      'Third-party assets (fonts, stock images, plugins, frameworks) remain subject to their own licences. We will notify you of any licence costs that apply to your project.',
      'We retain ownership of any tools, templates, or frameworks developed independently of your project that are used in its delivery.',
    ],
  },
  {
    heading: '8. Hosting and maintenance',
    body: [
      'Where we provide hosting, we will take reasonable steps to ensure availability and security, but we cannot guarantee 100% uptime. Scheduled maintenance will be communicated in advance where possible.',
      'If you choose to host with a third party, we are not responsible for performance, downtime, or security issues arising from that provider.',
      'Monthly maintenance or retainer agreements continue on a rolling basis and can be cancelled by either party with 30 days\' written notice.',
    ],
  },
  {
    heading: '9. Liability',
    body: [
      'We will carry out all work with reasonable skill and care. However, we cannot accept liability for any loss of business, loss of income, or indirect or consequential loss arising from our services or any delay in delivering them.',
      'Our total liability to you in connection with any project shall not exceed the total fees paid by you for that project.',
      'We are not liable for issues arising from content, data, or instructions you provide, nor for third-party services (payment gateways, hosting providers, plugin developers) that we have no direct control over.',
    ],
  },
  {
    heading: '10. Confidentiality',
    body: [
      'We will treat all information you share with us as confidential and will not disclose it to third parties without your consent, except where required by law.',
      'We may share project details with trusted subcontractors where necessary to deliver your project, subject to equivalent confidentiality obligations.',
    ],
  },
  {
    heading: '11. Cancellation',
    body: [
      'If you wish to cancel a project after work has commenced, you remain liable for payment for all work completed up to the date of cancellation. The deposit is non-refundable in all circumstances.',
      'If we are unable to complete a project due to circumstances within our control, we will refund a fair proportion of any fees paid for work not yet delivered.',
    ],
  },
  {
    heading: '12. Governing law',
    body: [
      'These terms are governed by the laws of Scotland. Any disputes will be subject to the exclusive jurisdiction of the Scottish courts.',
    ],
  },
  {
    heading: '13. Contact',
    body: [
      'If you have any questions about these terms, please contact us at hello@nithdigital.uk or by post to: Nith Digital, Sanquhar, Dumfries & Galloway, Scotland.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <div style={{ background: '#1B2A4A', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#F5F0E6', fontWeight: 400, marginBottom: 8 }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(245,240,230,0.6)', maxWidth: 440, margin: '0 auto' }}>
          Please read these terms before engaging our services.
        </p>
      </div>

      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          {SECTIONS.map((s) => (
            <div key={s.heading} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, marginBottom: 12 }}>
                {s.heading}
              </h2>
              {s.body.map((para, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: '#5A6A7A', marginBottom: 10 }}>
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
