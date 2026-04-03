export const dynamic = 'force-static'

import type { Metadata } from 'next'
import AdminLaunchpadClient from './AdminLaunchpadClient'

export const metadata: Metadata = { title: 'Launchpad Analytics — Admin' }

export default function AdminLaunchpadPage() {
  return <AdminLaunchpadClient progress={[]} profiles={[]} promoCodes={[]} />
}
