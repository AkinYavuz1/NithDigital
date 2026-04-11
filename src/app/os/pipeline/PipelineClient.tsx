'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Plus, Search, Clock, Globe, CheckCircle2, PauseCircle } from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { PIPELINE_STAGES, STATUS_LABELS, PROJECT_TYPE_LABELS, STAGE_ORDER, StageId } from '@/lib/pipelineStages'

interface Project {
  id: string
  name: string
  status: string
  project_type: string
  budget: number | null
  target_date: string | null
  launched_at: string | null
  live_url: string | null
  client_id: string | null
  client_name?: string
  created_at: string
  task_total: number
  task_done: number
}

const ALL_STATUSES = [
  'all',
  ...STAGE_ORDER,
  'completed',
  'on_hold',
]

const STATUS_DOT: Record<string, string> = {
  pre_project: '#6B7280',
  discovery: '#7C3AED',
  planning: '#2563EB',
  design: '#DB2777',
  development: '#059669',
  content: '#D97706',
  qa: '#DC2626',
  client_review: '#0891B2',
  launch_prep: '#EA580C',
  deployment: '#16A34A',
  post_launch: '#D4A84B',
  completed: '#10B981',
  on_hold: '#9CA3AF',
}

function progressPercent(status: string, done: number, total: number): number {
  if (status === 'completed') return 100
  if (total === 0) return 0
  const stageIdx = STAGE_ORDER.indexOf(status as StageId)
  const stageProgress = stageIdx >= 0 ? ((stageIdx) / STAGE_ORDER.length) * 100 : 0
  const taskProgress = (done / total) * (100 / STAGE_ORDER.length)
  return Math.min(Math.round(stageProgress + taskProgress), 99)
}

export default function PipelineClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: rows } = await supabase
      .from('pipeline_projects')
      .select('*, clients(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!rows) { setLoading(false); return }

    const ids = rows.map((r: { id: string }) => r.id)
    const { data: tasks } = ids.length
      ? await supabase.from('pipeline_tasks').select('project_id, is_done').in('project_id', ids)
      : { data: [] }

    const taskMap: Record<string, { total: number; done: number }> = {}
    for (const t of tasks || []) {
      if (!taskMap[t.project_id]) taskMap[t.project_id] = { total: 0, done: 0 }
      taskMap[t.project_id].total++
      if (t.is_done) taskMap[t.project_id].done++
    }

    setProjects(rows.map((r: {
      id: string; name: string; status: string; project_type: string;
      budget: number | null; target_date: string | null; launched_at: string | null;
      live_url: string | null; client_id: string | null; created_at: string;
      clients: { name: string } | null
    }) => ({
      id: r.id, name: r.name, status: r.status, project_type: r.project_type,
      budget: r.budget, target_date: r.target_date, launched_at: r.launched_at,
      live_url: r.live_url, client_id: r.client_id, created_at: r.created_at,
      client_name: r.clients?.name,
      task_total: taskMap[r.id]?.total ?? 0,
      task_done: taskMap[r.id]?.done ?? 0,
    })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = projects.filter((p) => {
    const matchStatus = filter === 'all' || p.status === filter
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.client_name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const active = projects.filter(p => !['completed', 'on_hold'].includes(p.status)).length
  const completed = projects.filter(p => p.status === 'completed').length

  return (
    <div>
      <OSPageHeader
        title="Projects"
        description={`${active} active · ${completed} completed`}
        action={
          <Link href="/os/pipeline/new" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            <Plus size={14} /> New project
          </Link>
        }
      />

      <div style={{ padding: 32 }} className="os-page-wrap">
        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '0 0 280px' }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5A6A7A' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid rgba(27,42,74,0.12)', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </div>

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4, flexWrap: 'wrap' }}>
          {ALL_STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: filter === s ? 600 : 400, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', border: '1px solid',
                background: filter === s ? '#1B2A4A' : 'transparent',
                color: filter === s ? '#F5F0E6' : '#5A6A7A',
                borderColor: filter === s ? '#1B2A4A' : 'rgba(27,42,74,0.15)',
              }}>
              {s === 'all' ? 'All' : STATUS_LABELS[s] ?? s}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: '#5A6A7A', fontSize: 14 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#5A6A7A' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗂️</div>
            <p style={{ marginBottom: 16 }}>No projects yet.</p>
            <Link href="/os/pipeline/new" style={{ padding: '10px 20px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
              Start your first project
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((p) => {
              const pct = progressPercent(p.status, p.task_done, p.task_total)
              const dot = STATUS_DOT[p.status] ?? '#9CA3AF'
              const stage = PIPELINE_STAGES.find(s => s.id === p.status)
              const isOverdue = p.target_date && p.status !== 'completed' && new Date(p.target_date) < new Date()
              return (
                <Link key={p.id} href={`/os/pipeline/${p.id}`}
                  style={{ display: 'block', background: '#fff', borderRadius: 10, padding: '18px 20px', border: '1px solid rgba(27,42,74,0.08)', transition: 'border-color 0.2s', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 16 }}>{stage?.icon ?? '📁'}</span>
                        <span style={{ fontWeight: 600, fontSize: 15, color: '#1B2A4A' }}>{p.name}</span>
                        {p.client_name && (
                          <span style={{ fontSize: 12, color: '#5A6A7A' }}>— {p.client_name}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                          <span style={{ color: dot, fontWeight: 500 }}>{STATUS_LABELS[p.status] ?? p.status}</span>
                        </span>
                        <span style={{ fontSize: 12, color: '#5A6A7A', background: 'rgba(27,42,74,0.05)', padding: '2px 8px', borderRadius: 100 }}>
                          {PROJECT_TYPE_LABELS[p.project_type] ?? p.project_type}
                        </span>
                        {p.target_date && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: isOverdue ? '#DC2626' : '#5A6A7A' }}>
                            <Clock size={11} />
                            {isOverdue ? 'Overdue: ' : 'Due: '}
                            {new Date(p.target_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {p.live_url && p.status === 'completed' && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#059669' }}>
                            <Globe size={11} /> {p.live_url.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      {p.status === 'completed' ? (
                        <CheckCircle2 size={20} color="#10B981" />
                      ) : p.status === 'on_hold' ? (
                        <PauseCircle size={20} color="#9CA3AF" />
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#1B2A4A' }}>{pct}%</span>
                          <div style={{ width: 100, height: 5, background: 'rgba(27,42,74,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: dot, borderRadius: 100, transition: 'width 0.4s ease' }} />
                          </div>
                          {p.task_total > 0 && (
                            <span style={{ fontSize: 11, color: '#5A6A7A' }}>{p.task_done}/{p.task_total} tasks</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
