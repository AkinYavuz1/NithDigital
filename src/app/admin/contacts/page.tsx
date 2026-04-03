import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminContactsClient from './AdminContactsClient'

export const metadata: Metadata = { title: 'Contact Submissions — Admin' }

export default async function AdminContactsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: submissions } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  return <AdminContactsClient initialSubmissions={submissions || []} />
}
