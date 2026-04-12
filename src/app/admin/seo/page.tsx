import type { Metadata } from 'next'
import SeoClient from './SeoClient'

export const metadata: Metadata = {
  title: 'SEO — Nith Digital Admin',
}

export default function SeoPage() {
  return <SeoClient />
}
