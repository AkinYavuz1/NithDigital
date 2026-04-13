'use server'

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  let code = 'TD-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function createAccessCode(notes: string | null, expiresDays: number | null) {
  const expires_at = expiresDays
    ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString()
    : null

  for (let attempts = 0; attempts < 5; attempts++) {
    const code = generateCode()
    const { data, error } = await sb
      .from('tradedesk_access_codes')
      .insert({ code, notes, expires_at })
      .select('id, code, notes, expires_at, created_at')
      .single()

    if (!error && data) {
      return { success: true as const, code: data }
    }
    if (error && error.code !== '23505') {
      return { success: false as const, error: error.message }
    }
  }

  return { success: false as const, error: 'Failed to generate unique code' }
}
