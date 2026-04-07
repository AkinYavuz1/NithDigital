export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import AdminReferralsClient from './AdminReferralsClient'
export const metadata: Metadata = { title: 'Referrals — Admin' }
export default function AdminReferralsPage() { return <AdminReferralsClient /> }
