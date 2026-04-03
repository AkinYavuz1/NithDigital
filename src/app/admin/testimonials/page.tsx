import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminTestimonialsClient from './AdminTestimonialsClient'

export const metadata: Metadata = { title: 'Testimonials — Admin' }

export default async function AdminTestimonialsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('submitted_at', { ascending: false })
  const { data: clients } = await supabase
    .from('clients')
    .select('id,name,email')
    .order('name')
  return <AdminTestimonialsClient initialTestimonials={testimonials || []} clients={clients || []} />
}
