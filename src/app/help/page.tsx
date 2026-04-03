import type { Metadata } from 'next'
import HelpIndexClient from './HelpIndexClient'

export const metadata: Metadata = {
  title: 'Help Centre — Nith Digital',
  description: 'Find answers to common questions about the Business OS. Guides on invoicing, expenses, clients, tax, mileage, and more.',
}

export default function HelpPage() {
  return <HelpIndexClient />
}
