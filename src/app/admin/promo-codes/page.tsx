
export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import AdminPromoCodesClient from './AdminPromoCodesClient'

export const metadata: Metadata = { title: 'Promo Codes — Admin' }

export default function AdminPromoCodesPage() {
  return <AdminPromoCodesClient initialCodes={[]} />
}
