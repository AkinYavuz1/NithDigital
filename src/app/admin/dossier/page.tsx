export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import DossierClient from './DossierClient'

export const metadata: Metadata = { title: 'Client Dossiers — Admin' }

export default function DossierPage() {
  return <DossierClient />
}
