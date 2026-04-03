import type { Metadata } from 'next'
import ReferralsClient from './ReferralsClient'
export const metadata: Metadata = { title: 'Referrals — Business OS' }
export default function ReferralsPage() { return <ReferralsClient /> }
