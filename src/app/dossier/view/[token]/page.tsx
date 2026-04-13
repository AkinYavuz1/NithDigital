import type { Metadata } from 'next'
import PublicDossierWrapper from './PublicDossierWrapper'

export const metadata: Metadata = { title: 'Digital Health Report — Nith Digital' }

export default function PublicDossierPage() {
  return <PublicDossierWrapper />
}
