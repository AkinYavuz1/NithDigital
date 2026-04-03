'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import ProposalEditor from './ProposalEditor'
import type { ProposalForm } from './ProposalEditor'

export default function ProposalEditorLoader({ id }: { id: string }) {
  const [proposal, setProposal] = useState<(ProposalForm & { id: string; public_token: string }) | null | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('proposals').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setProposal({
          ...data,
          estimated_price_low: data.estimated_price_low?.toString() || '',
          estimated_price_high: data.estimated_price_high?.toString() || '',
          monthly_cost: data.monthly_cost?.toString() || '',
          contact_name: data.contact_name || '',
          contact_email: data.contact_email || '',
          notes: data.notes || '',
          internal_notes: data.internal_notes || '',
          demo_url: data.demo_url || '',
          selected_services: data.selected_services || [],
          custom_bullets: data.custom_bullets || [],
        })
      } else {
        setProposal(null)
      }
    })
  }, [id])

  if (proposal === undefined) return <div style={{ padding: 48, textAlign: 'center', color: '#5A6A7A', fontSize: 13 }}>Loading…</div>
  if (proposal === null) return <div style={{ padding: 48, textAlign: 'center', color: '#5A6A7A', fontSize: 13 }}>Proposal not found</div>

  return <ProposalEditor proposal={proposal} />
}
