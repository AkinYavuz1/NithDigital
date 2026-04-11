'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import OSPageHeader from '@/components/OSPageHeader'
import { PIPELINE_STAGES, PROJECT_TYPE_LABELS } from '@/lib/pipelineStages'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  border: '1px solid rgba(27,42,74,0.15)', borderRadius: 8,
  fontFamily: 'inherit', fontSize: 14, outline: 'none', background: '#fff',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 500, marginBottom: 4,
  color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px',
}

export default function NewProjectForm() {
  const router = useRouter()
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    client_id: '',
    project_type: 'website',
    budget: '',
    start_date: new Date().toISOString().split('T')[0],
    target_date: '',
    domain: '',
    notes: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: cls } = await supabase.from('clients').select('id, name').eq('user_id', data.user.id).order('name')
      setClients(cls || [])
    })
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      client_id: form.client_id || null,
      project_type: form.project_type,
      budget: form.budget ? parseFloat(form.budget) : null,
      start_date: form.start_date || null,
      target_date: form.target_date || null,
      domain: form.domain.trim() || null,
      notes: form.notes.trim() || null,
      status: 'pre_project',
    }

    const { data: project, error } = await supabase
      .from('pipeline_projects')
      .insert([payload])
      .select()
      .single()

    if (error || !project) { setSaving(false); return }

    // Seed tasks for all stages up-front so the full pipeline is visible immediately
    const allTasks = PIPELINE_STAGES.flatMap((stage, stageIdx) =>
      stage.checklist.map((item, itemIdx) => ({
        user_id: user.id,
        project_id: project.id,
        stage: stage.id,
        title: item.title,
        description: item.description ?? null,
        requires_client: item.requiresClient ?? false,
        sort_order: stageIdx * 100 + itemIdx,
        is_done: false,
      }))
    )

    await supabase.from('pipeline_tasks').insert(allTasks)

    router.push(`/os/pipeline/${project.id}`)
  }

  return (
    <div>
      <OSPageHeader title="New Project" description="Set up a new web development project pipeline" />
      <div style={{ padding: 32, maxWidth: 680 }} className="os-page-wrap">
        <div style={{ background: '#fff', borderRadius: 10, padding: 32, border: '1px solid rgba(27,42,74,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Project name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Smith & Co Website Redesign"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Client</label>
              <select value={form.client_id} onChange={e => set('client_id', e.target.value)} style={inputStyle}>
                <option value="">No client linked</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Project type</label>
              <select value={form.project_type} onChange={e => set('project_type', e.target.value)} style={inputStyle}>
                {Object.entries(PROJECT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Budget (£)</label>
              <input type="number" min={0} step={0.01} value={form.budget}
                onChange={e => set('budget', e.target.value)}
                placeholder="0.00" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Domain</label>
              <input value={form.domain} onChange={e => set('domain', e.target.value)}
                placeholder="e.g. smithandco.co.uk" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Start date</label>
              <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Target launch date</label>
              <input type="date" value={form.target_date} onChange={e => set('target_date', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                placeholder="Any additional context about this project..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(212,168,75,0.08)', border: '1px solid rgba(212,168,75,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: '#1B2A4A', margin: 0 }}>
              <strong>All 11 pipeline stages</strong> and their complete checklists will be created automatically when you save this project.
              You can tick off tasks, add notes, and advance the project stage as you go.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSave} disabled={saving || !form.name.trim()}
              style={{ padding: '10px 24px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: saving || !form.name.trim() ? 'not-allowed' : 'pointer', opacity: saving || !form.name.trim() ? 0.6 : 1 }}>
              {saving ? 'Creating...' : 'Create project'}
            </button>
            <Link href="/os/pipeline" style={{ padding: '10px 24px', background: 'transparent', color: '#5A6A7A', borderRadius: 100, fontSize: 13, border: '1px solid rgba(27,42,74,0.15)' }}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
