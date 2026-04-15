export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import SocialDashboardClient from './SocialDashboardClient'

export const metadata: Metadata = { title: 'Social Media — Nith Digital Admin' }

export default function SocialPage() {
  return <SocialDashboardClient />
}
