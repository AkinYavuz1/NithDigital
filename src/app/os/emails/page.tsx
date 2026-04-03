export const runtime = 'edge'

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import OSEmailsClient from './OSEmailsClient'

export const metadata: Metadata = { title: 'Email Queue — Business OS' }

export default async function OSEmailsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: emails } = await supabase
    .from('email_queue')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: clients } = await supabase
    .from('clients')
    .select('id,name,email')
    .order('name')

  return <OSEmailsClient initialEmails={emails || []} clients={clients || []} />
}
