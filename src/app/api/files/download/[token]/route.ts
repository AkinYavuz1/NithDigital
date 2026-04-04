import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: file } = await supabaseAdmin
    .from('client_files')
    .select('id, file_path, file_name, share_expires_at, download_count')
    .eq('share_token', token)
    .single()

  if (!file || (file.share_expires_at && new Date(file.share_expires_at) < new Date())) {
    return NextResponse.json({ error: 'Link expired or invalid' }, { status: 404 })
  }

  const { data } = await supabaseAdmin.storage
    .from('client-files')
    .createSignedUrl(file.file_path, 60)

  if (!data?.signedUrl) {
    return NextResponse.json({ error: 'Could not generate download URL' }, { status: 500 })
  }

  // Increment download count
  await supabaseAdmin.from('client_files').update({ download_count: file.download_count + 1 }).eq('id', file.id)

  return NextResponse.redirect(data.signedUrl)
}
