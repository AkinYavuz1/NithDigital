export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — list all recordings
export async function GET() {
  const { data, error } = await sb
    .from('call_recordings')
    .select('*')
    .order('called_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ recordings: data })
}

// POST — upload audio, transcribe, analyse
export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  const businessName = (form.get('business_name') as string || '').trim()
  const contactPhone = (form.get('contact_phone') as string || '').trim()
  const outcome = (form.get('outcome') as string || 'no_answer').trim()
  const prospectId = (form.get('prospect_id') as string || '').trim() || null

  if (!file || !businessName) {
    return NextResponse.json({ error: 'Missing file or business_name' }, { status: 400 })
  }

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop() || 'm4a'
  const path = `calls/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const arrayBuf = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuf)

  const { error: uploadError } = await sb.storage
    .from('call-recordings')
    .upload(path, buffer, { contentType: file.type || 'audio/m4a', upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 })
  }

  const { data: urlData } = sb.storage.from('call-recordings').getPublicUrl(path)
  const recordingUrl = urlData.publicUrl

  // Insert record immediately so UI shows it while processing
  const { data: rec, error: insertError } = await sb
    .from('call_recordings')
    .insert({
      business_name: businessName,
      contact_phone: contactPhone || null,
      prospect_id: prospectId,
      recording_url: recordingUrl,
      outcome,
    })
    .select('id')
    .single()

  if (insertError || !rec) {
    return NextResponse.json({ error: 'Failed to save recording' }, { status: 500 })
  }

  const recordingId = rec.id

  // Transcribe with Groq Whisper (non-blocking — fire and forget so response is fast)
  transcribeAndAnalyse(recordingId, buffer, file.type || 'audio/m4a', businessName, outcome).catch(
    (err) => console.error('[call-recordings] transcription error:', err)
  )

  return NextResponse.json({ ok: true, id: recordingId })
}

async function transcribeAndAnalyse(
  recordingId: string,
  buffer: Buffer,
  mimeType: string,
  businessName: string,
  outcome: string
) {
  try {
    // Groq Whisper transcription
    const formData = new FormData()
    const blob = new Blob([buffer], { type: mimeType })
    formData.append('file', blob, `recording.${mimeType.split('/')[1] || 'm4a'}`)
    formData.append('model', 'whisper-large-v3')
    formData.append('language', 'en')
    formData.append('response_format', 'text')

    const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: formData,
    })

    if (!whisperRes.ok) {
      const err = await whisperRes.text()
      throw new Error(`Whisper error: ${err}`)
    }

    const transcript = (await whisperRes.text()).trim()

    // Estimate duration from file size (rough: ~16KB/sec for m4a at 128kbps)
    const durationSecs = Math.round(buffer.length / 16000)

    // AI analysis with LLaMA
    const analysisRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
        messages: [
          {
            role: 'system',
            content: `You are a cold call coach analysing sales calls made by Akin at Nith Digital, a web design agency in Scotland. He is cold calling small businesses with broken or outdated websites. Be direct, honest, and specific. Your job is to help him improve his conversion rate.`,
          },
          {
            role: 'user',
            content: `Analyse this cold call transcript. Business: ${businessName}. Outcome: ${outcome}.

TRANSCRIPT:
${transcript}

Respond in this exact JSON format:
{
  "score": <number 1-10 — overall call quality>,
  "outcome_summary": "<1 sentence — what happened>",
  "what_worked": "<specific things Akin did well — be concrete>",
  "what_to_improve": "<specific things to do differently next time>",
  "objections": ["<objection 1>", "<objection 2>"],
  "objection_handling": "<how well did he handle objections? what should he have said?>",
  "coaching_tip": "<single most important thing to focus on for the next call>"
}`,
          },
        ],
      }),
    })

    const analysisData = await analysisRes.json()
    const rawAnalysis = analysisData.choices?.[0]?.message?.content?.trim() || '{}'

    let aiSummary = rawAnalysis
    try {
      JSON.parse(rawAnalysis) // validate it's valid JSON
    } catch {
      aiSummary = JSON.stringify({ coaching_tip: rawAnalysis })
    }

    // Update record with transcript and analysis
    await sb.from('call_recordings').update({
      transcript,
      ai_summary: aiSummary,
      duration_secs: durationSecs,
    }).eq('id', recordingId)

  } catch (err) {
    console.error('[call-recordings] transcribeAndAnalyse failed:', err)
    // Still update with error note so UI doesn't show spinning forever
    await sb.from('call_recordings').update({
      transcript: 'Transcription failed — please try re-uploading.',
    }).eq('id', recordingId)
  }
}
