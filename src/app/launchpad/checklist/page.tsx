import type { Metadata } from 'next'
import ChecklistClient from './ChecklistClient'

export const metadata: Metadata = {
  title: 'Startup Checklist — Nith Digital Launchpad',
  description: '10 steps to launch your Scottish sole trader business. Free checklist with step-by-step guidance, provider comparisons, and links to official resources.',
}

export default function ChecklistPage() {
  return <ChecklistClient />
}
