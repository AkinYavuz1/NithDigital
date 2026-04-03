export const runtime = 'edge'

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminUsersClient from './AdminUsersClient'

export const metadata: Metadata = { title: 'Users — Admin' }

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('id,email,full_name,business_name,subscription_tier,created_at,is_admin')
    .order('created_at', { ascending: false })
  return <AdminUsersClient initialUsers={users || []} />
}
