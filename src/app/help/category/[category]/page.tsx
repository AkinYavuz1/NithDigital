import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import HelpCategoryWrapper from './HelpCategoryWrapper'

interface Props {
  params: Promise<{ category: string }>
}

const CATEGORY_INFO: Record<string, { label: string; desc: string }> = {
  'getting-started': { label: 'Getting Started', desc: 'Everything you need to set up your account and start using Business OS.' },
  'launchpad': { label: 'Launchpad', desc: 'How the checklist works and how to make the most of your free Launchpad.' },
  'invoicing': { label: 'Invoicing', desc: 'Creating, sending, and managing your invoices.' },
  'expenses': { label: 'Expenses', desc: 'Logging expenses, understanding allowable deductions, and categorisation.' },
  'clients': { label: 'Clients', desc: 'Managing your client list and invoice history.' },
  'tax': { label: 'Tax', desc: 'Using the tax estimator and understanding National Insurance.' },
  'mileage': { label: 'Mileage', desc: 'Tracking business journeys and HMRC mileage rates.' },
  'quotes': { label: 'Quotes', desc: 'Creating quotes and converting them to invoices.' },
  'reports': { label: 'Reports', desc: 'Generating financial reports and summaries.' },
  'account': { label: 'Account', desc: 'Managing your profile and subscription settings.' },
  'billing': { label: 'Billing', desc: 'Payments, the Startup Bundle, and your subscription.' },
  'booking': { label: 'Booking', desc: 'Booking and managing consultations.' },
  'troubleshooting': { label: 'Troubleshooting', desc: 'Solutions to common issues.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const info = CATEGORY_INFO[category]
  const title = info ? `${info.label} — Help Centre` : 'Help Category — Nith Digital'
  const description = info?.desc || ''
  const url = `https://nithdigital.uk/help/category/${category}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Nith Digital', locale: 'en_GB', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function HelpCategoryPage({ params }: Props) {
  const { category } = await params
  return (
    <>
      <Navbar />
      <HelpCategoryWrapper category={category} categoryInfo={CATEGORY_INFO[category]} />
      <Footer />
    </>
  )
}
