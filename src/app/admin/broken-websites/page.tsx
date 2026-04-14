import type { Metadata } from 'next'
import BrokenWebsitesClient from './BrokenWebsitesClient'

export const metadata: Metadata = {
  title: 'Broken Websites — Nith Digital Admin',
}

export default function BrokenWebsitesPage() {
  return <BrokenWebsitesClient />
}
