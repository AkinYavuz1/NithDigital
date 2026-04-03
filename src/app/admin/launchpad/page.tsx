export const runtime = 'edge'

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminLaunchpadClient from './AdminLaunchpadClient'

export const metadata: Metadata = { title: 'Launchpad Analytics — Admin' }

export default async function AdminLaunchpadPage() {
  const supabase = await createServerSupabaseClient()

  const { data: progress } = await supabase
    .from('launchpad_progress')
    .select('user_id,step_number,completed,created_at,updated_at')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id,email,full_name,business_name,created_at')

  const { data: promoCodes } = await supabase
    .from('promo_codes')
    .select('user_id,code,redeemed,created_at,redeemed_at')

  return (
    <AdminLaunchpadClient
      progress={progress || []}
      profiles={profiles || []}
      promoCodes={promoCodes || []}
    />
  )
}
