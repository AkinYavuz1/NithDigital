export const runtime = 'edge'

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminPromoCodesClient from './AdminPromoCodesClient'

export const metadata: Metadata = { title: 'Promo Codes — Admin' }

export default async function AdminPromoCodesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: codes } = await supabase
    .from('promo_codes')
    .select(`
      id, code, type, redeemed, created_at, redeemed_at, user_id,
      profiles!promo_codes_user_id_fkey(email, business_name, full_name)
    `)
    .order('created_at', { ascending: false })
  return <AdminPromoCodesClient initialCodes={codes || []} />
}
