'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import OSPageHeader from '@/components/OSPageHeader'
import {
  PIPELINE_STAGES, STATUS_LABELS, PROJECT_TYPE_LABELS, STAGE_ORDER, StageId
} from '@/lib/pipelineStages'
import {
  ChevronRight, CheckCircle2, Circle, AlertTriangle, User, Zap,
  Clock, Package, ChevronDown, ChevronUp, Globe, Plus, Trash2,
  ArrowRight, Info,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Project {
  id: string; name: string; status: string; project_type: string
  budget: number | null; deposit_paid: boolean; contract_signed: boolean
  start_date: string | null; target_date: string | null; launched_at: string | null
  domain: string | null; staging_url: string | null; live_url: string | null
  notes: string | null; client_id: string | null; client_name?: string
  created_at: string
}

interface Task {
  id: string; stage: string; title: string; description: string | null
  is_done: boolean; is_blocked: boolean; blocker_note: string | null
  requires_client: boolean; sort_order: number; completed_at: string | null
}

interface Note {
  id: string; stage: string | null; body: string; created_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  pre_project: '#6B7280', discovery: '#7C3AED', planning: '#2563EB',
  design: '#DB2777', development: '#059669', content: '#D97706',
  qa: '#DC2626', client_review: '#0891B2', launch_prep: '#EA580C',
  deployment: '#16A34A', post_launch: '#D4A84B', completed: '#10B981', on_hold: '#9CA3AF',
}

function fmtDate(d: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectPipelineClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [, setActiveStage] = useState<StageId | null>(null)
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())
  const [noteText, setNoteText] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showStageInfo, setShowStageInfo] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: proj }, { data: taskRows }, { data: noteRows }] = await Promise.all([
      supabase.from('pipeline_projects').select('*, clients(name)').eq('id', projectId).eq('user_id', user.id).single(),
      supabase.from('pipeline_tasks').select('*').eq('project_id', projectId).order('sort_order'),
      supabase.from('pipeline_notes').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    ])

    if (!proj) { setLoading(false); return }
    setProject({ ...proj, client_name: proj.clients?.name })
    setTasks(taskRows || [])
    setNotes(noteRows || [])

    // Default active stage to the project's current stage
    const currentStage = proj.status as StageId
    setActiveStage(currentStage)
    setExpandedStages(new Set([currentStage]))
    setLoading(false)
  }, [projectId])

  useEffect(() => { load() }, [load])

  // ─── Task toggles ──────────────────────────────────────────────────────────

  const toggleTask = async (task: Task) => {
    const supabase = createClient()
    const isDone = !task.is_done
    await supabase.from('pipeline_tasks').update({
      is_done: isDone,
      completed_at: isDone ? new Date().toISOString() : null,
    }).eq('id', task.id)
    setTasks(ts => ts.map(t => t.id === task.id ? { ...t, is_done: isDone, completed_at: isDone ? new Date().toISOString() : null } : t))
  }

  // ─── Advance stage ─────────────────────────────────────────────────────────

  const advanceStage = async () => {
    if (!project) return
    const supabase = createClient()
    const idx = STAGE_ORDER.indexOf(project.status as StageId)
    if (idx < 0 || idx >= STAGE_ORDER.length - 1) {
      await supabase.from('pipeline_projects').update({ status: 'completed' }).eq('id', project.id)
      setProject(p => p ? { ...p, status: 'completed' } : p)
      return
    }
    const next = STAGE_ORDER[idx + 1]
    await supabase.from('pipeline_projects').update({ status: next }).eq('id', project.id)
    setProject(p => p ? { ...p, status: next } : p)
    setActiveStage(next)
    setExpandedStages(prev => new Set([...prev, next]))
  }

  const setStageManually = async (stage: StageId | 'completed' | 'on_hold') => {
    if (!project) return
    const supabase = createClient()
    await supabase.from('pipeline_projects').update({ status: stage }).eq('id', project.id)
    setProject(p => p ? { ...p, status: stage } : p)
    if (STAGE_ORDER.includes(stage as StageId)) setActiveStage(stage as StageId)
  }

  // ─── Notes ────────────────────────────────────────────────────────────────

  const addNote = async () => {
    if (!noteText.trim() || !project) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { data } = await supabase.from('pipeline_notes').insert([{
      user_id: user.id, project_id: project.id,
      stage: project.status, body: noteText.trim(),
    }]).select().single()
    if (data) setNotes(n => [data, ...n])
    setNoteText('')
    setSaving(false)
  }

  const deleteNote = async (id: string) => {
    const supabase = createClient()
    await supabase.from('pipeline_notes').delete().eq('id', id)
    setNotes(n => n.filter(x => x.id !== id))
  }

  // ─── Expand/collapse stages ────────────────────────────────────────────────

  const toggleExpand = (id: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  // ─── Derived ──────────────────────────────────────────────────────────────

  const tasksByStage = (stageId: string) => tasks.filter(t => t.stage === stageId)
  const stageDone = (stageId: string) => {
    const t = tasksByStage(stageId)
    return t.length > 0 && t.every(x => x.is_done)
  }
  const stageProgress = (stageId: string) => {
    const t = tasksByStage(stageId)
    if (t.length === 0) return 0
    return Math.round((t.filter(x => x.is_done).length / t.length) * 100)
  }
  const currentStageIdx = project ? STAGE_ORDER.indexOf(project.status as StageId) : -1
  const nextStage = currentStageIdx >= 0 && currentStageIdx < STAGE_ORDER.length - 1
    ? PIPELINE_STAGES[currentStageIdx + 1] : null

  if (loading) return <div style={{ padding: 40, color: '#5A6A7A' }}>Loading project...</div>
  if (!project) return <div style={{ padding: 40, color: '#5A6A7A' }}>Project not found.</div>

  const isCompleted = project.status === 'completed'
  const isOnHold = project.status === 'on_hold'
  const currentStageData = PIPELINE_STAGES.find(s => s.id === project.status)

  return (
    <div>
      <OSPageHeader
        title={project.name}
        description={
          project.client_name
            ? `${project.client_name} · ${PROJECT_TYPE_LABELS[project.project_type] ?? project.project_type}`
            : PROJECT_TYPE_LABELS[project.project_type] ?? project.project_type
        }
        action={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {!isCompleted && !isOnHold && nextStage && (
              <button onClick={advanceStage}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#D4A84B', color: '#1B2A4A', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Advance to {nextStage.label} <ArrowRight size={13} />
              </button>
            )}
            {!isCompleted && !isOnHold && currentStageIdx === STAGE_ORDER.length - 1 && (
              <button onClick={advanceStage}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#10B981', color: '#fff', borderRadius: 100, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Mark completed <CheckCircle2 size={13} />
              </button>
            )}
            <Link href="/os/pipeline" style={{ padding: '9px 16px', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 100, fontSize: 13, color: '#5A6A7A' }}>
              All projects
            </Link>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0, height: 'calc(100vh - 97px)', overflow: 'hidden' }} className="pipeline-layout">

        {/* ── Left: Stage pipeline ─────────────────────────────────────────── */}
        <div style={{ overflowY: 'auto', padding: 28 }}>

          {/* Current stage banner */}
          {currentStageData && !isCompleted && !isOnHold && (
            <div style={{ background: `${currentStageData.bgColor}`, border: `1px solid ${currentStageData.color}30`, borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{currentStageData.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#5A6A7A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Current stage</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: currentStageData.color }}>{currentStageData.label}</div>
                <div style={{ fontSize: 12, color: '#5A6A7A', marginTop: 2 }}>{currentStageData.typicalDuration} typical · {currentStageData.summary}</div>
              </div>
              <button onClick={() => setShowStageInfo(showStageInfo === project.status ? null : project.status)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A6A7A', padding: 4 }}>
                <Info size={16} />
              </button>
            </div>
          )}

          {isCompleted && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={20} color="#10B981" />
              <div>
                <div style={{ fontWeight: 700, color: '#10B981', fontSize: 15 }}>Project completed</div>
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Globe size={11} /> {project.live_url}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Stage list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PIPELINE_STAGES.map((stage, idx) => {
              const stageTasks = tasksByStage(stage.id)
              const doneCnt = stageTasks.filter(t => t.is_done).length
              const pct = stageProgress(stage.id)
              const done = stageDone(stage.id)
              const isCurrent = project.status === stage.id
              const isPast = currentStageIdx > idx
              const isFuture = currentStageIdx >= 0 && idx > currentStageIdx
              const isExpanded = expandedStages.has(stage.id)
              const blockers = stageTasks.filter(t => t.is_blocked)
              const clientTasks = stageTasks.filter(t => t.requires_client && !t.is_done)
              const dot = STATUS_DOT[stage.id]

              return (
                <div key={stage.id}
                  style={{
                    background: '#fff', borderRadius: 10,
                    border: isCurrent ? `1.5px solid ${dot}` : '1px solid rgba(27,42,74,0.08)',
                    opacity: isFuture && !isExpanded ? 0.65 : 1,
                    transition: 'opacity 0.2s',
                  }}>
                  {/* Stage header */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', cursor: 'pointer' }}
                    onClick={() => toggleExpand(stage.id)}>

                    {/* Stage number / check */}
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: done || isPast ? dot : isCurrent ? dot : 'rgba(27,42,74,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {done || (isPast && pct === 100) ? (
                        <CheckCircle2 size={14} color="#fff" />
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 700, color: isCurrent ? '#fff' : '#9CA3AF' }}>{idx + 1}</span>
                      )}
                    </div>

                    <span style={{ fontSize: 16, flexShrink: 0 }}>{stage.icon}</span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: isCurrent ? 700 : 600, color: isCurrent ? dot : '#1B2A4A' }}>{stage.label}</span>
                        {isCurrent && <span style={{ fontSize: 10, padding: '2px 8px', background: `${dot}20`, color: dot, borderRadius: 100, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Current</span>}
                        {blockers.length > 0 && <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(220,38,38,0.08)', color: '#DC2626', borderRadius: 100, fontWeight: 600 }}>{blockers.length} blocked</span>}
                        {clientTasks.length > 0 && <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(8,145,178,0.08)', color: '#0891B2', borderRadius: 100, fontWeight: 600 }}>{clientTasks.length} awaiting client</span>}
                      </div>
                      {stageTasks.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <div style={{ flex: 1, height: 4, background: 'rgba(27,42,74,0.08)', borderRadius: 100, overflow: 'hidden', maxWidth: 200 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10B981' : dot, borderRadius: 100, transition: 'width 0.3s ease' }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#5A6A7A', whiteSpace: 'nowrap' }}>{doneCnt}/{stageTasks.length}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: '#5A6A7A' }}>{stage.typicalDuration}</span>
                      {isExpanded ? <ChevronUp size={14} color="#5A6A7A" /> : <ChevronDown size={14} color="#5A6A7A" />}
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid rgba(27,42,74,0.06)', padding: '0 16px 16px' }}>

                      {/* Stage info panel */}
                      {(showStageInfo === stage.id || isCurrent) && (
                        <div style={{ background: '#F5F0E6', borderRadius: 8, padding: 14, margin: '14px 0', fontSize: 12 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                              <div style={{ fontWeight: 600, color: '#1B2A4A', marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deliverables</div>
                              {stage.deliverables.map((d, i) => (
                                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3, color: '#5A6A7A' }}>
                                  <Package size={10} style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span>{d}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#1B2A4A', marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Common blockers</div>
                              {stage.commonBlockers.map((b, i) => (
                                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3, color: '#DC2626' }}>
                                  <AlertTriangle size={10} style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#1B2A4A', marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Can be automated</div>
                              {stage.automatable.map((a, i) => (
                                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3, color: '#059669' }}>
                                  <Zap size={10} style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span>{a.task} <span style={{ color: '#9CA3AF' }}>— {a.tool}</span></span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#1B2A4A', marginBottom: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Requires client input</div>
                              {stage.requiresClientInput.map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3, color: '#0891B2' }}>
                                  <User size={10} style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span>{r}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Checklist */}
                      <div style={{ marginTop: 12 }}>
                        {stageTasks.length === 0 ? (
                          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '8px 0' }}>No tasks for this stage yet.</p>
                        ) : (
                          stageTasks.map(task => (
                            <div key={task.id}
                              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(27,42,74,0.04)', cursor: 'pointer' }}
                              onClick={() => toggleTask(task)}>
                              <div style={{ marginTop: 1, flexShrink: 0 }}>
                                {task.is_done
                                  ? <CheckCircle2 size={16} color="#10B981" />
                                  : <Circle size={16} color={task.is_blocked ? '#DC2626' : 'rgba(27,42,74,0.25)'} />}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{
                                  fontSize: 13, color: task.is_done ? '#9CA3AF' : '#1B2A4A',
                                  textDecoration: task.is_done ? 'line-through' : 'none',
                                }}>
                                  {task.title}
                                </span>
                                <div style={{ display: 'flex', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                                  {task.requires_client && (
                                    <span style={{ fontSize: 10, padding: '1px 6px', background: 'rgba(8,145,178,0.08)', color: '#0891B2', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 3 }}>
                                      <User size={8} /> Client input required
                                    </span>
                                  )}
                                  {task.is_blocked && (
                                    <span style={{ fontSize: 10, padding: '1px 6px', background: 'rgba(220,38,38,0.08)', color: '#DC2626', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 3 }}>
                                      <AlertTriangle size={8} /> Blocked
                                    </span>
                                  )}
                                  {task.completed_at && (
                                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>
                                      Done {fmtDate(task.completed_at)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Advance stage from here */}
                      {isCurrent && nextStage && (
                        <button onClick={advanceStage}
                          style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#D4A84B', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          <ChevronRight size={14} /> Move to {nextStage.label}
                        </button>
                      )}
                      {isCurrent && !nextStage && !isCompleted && (
                        <button onClick={advanceStage}
                          style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#10B981', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          <CheckCircle2 size={14} /> Mark project as completed
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Right: Project sidebar ────────────────────────────────────────── */}
        <div style={{ borderLeft: '1px solid rgba(27,42,74,0.08)', overflowY: 'auto', background: '#FAFAF9' }}>

          {/* Project details */}
          <div style={{ padding: 20, borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#5A6A7A', marginBottom: 12 }}>Project Details</div>

            <DetailRow label="Status">
              <select value={project.status}
                onChange={e => setStageManually(e.target.value as StageId)}
                style={{ fontSize: 12, border: 'none', background: 'none', color: STATUS_DOT[project.status] ?? '#1B2A4A', fontWeight: 600, cursor: 'pointer', outline: 'none', padding: 0, fontFamily: 'inherit' }}>
                {[...STAGE_ORDER, 'completed', 'on_hold'].map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
                ))}
              </select>
            </DetailRow>
            {project.client_name && <DetailRow label="Client"><span style={{ fontSize: 13 }}>{project.client_name}</span></DetailRow>}
            <DetailRow label="Type"><span style={{ fontSize: 13 }}>{PROJECT_TYPE_LABELS[project.project_type] ?? project.project_type}</span></DetailRow>
            {project.budget && (
              <DetailRow label="Budget">
                <span style={{ fontSize: 13 }}>£{Number(project.budget).toLocaleString('en-GB', { minimumFractionDigits: 0 })}</span>
              </DetailRow>
            )}
            {project.target_date && (
              <DetailRow label="Target date">
                <span style={{ fontSize: 13, color: new Date(project.target_date) < new Date() && project.status !== 'completed' ? '#DC2626' : '#1B2A4A' }}>
                  <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                  {fmtDate(project.target_date)}
                </span>
              </DetailRow>
            )}
            {project.domain && (
              <DetailRow label="Domain">
                <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: '#2563EB', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Globe size={11} /> {project.domain}
                </a>
              </DetailRow>
            )}
            {project.staging_url && (
              <DetailRow label="Staging">
                <a href={project.staging_url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: '#2563EB', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {project.staging_url.replace(/^https?:\/\//, '')}
                </a>
              </DetailRow>
            )}
            {project.live_url && (
              <DetailRow label="Live URL">
                <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Globe size={11} /> {project.live_url.replace(/^https?:\/\//, '')}
                </a>
              </DetailRow>
            )}
            <DetailRow label="Contract" >
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 100, background: project.contract_signed ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: project.contract_signed ? '#10B981' : '#6B7280', fontWeight: 600 }}>
                {project.contract_signed ? 'Signed' : 'Pending'}
              </span>
            </DetailRow>
            <DetailRow label="Deposit">
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 100, background: project.deposit_paid ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: project.deposit_paid ? '#10B981' : '#6B7280', fontWeight: 600 }}>
                {project.deposit_paid ? 'Paid' : 'Unpaid'}
              </span>
            </DetailRow>
          </div>

          {/* Overall progress */}
          <div style={{ padding: 20, borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#5A6A7A', marginBottom: 12 }}>Overall Progress</div>
            {PIPELINE_STAGES.map((stage, idx) => {
              const pct = stageProgress(stage.id)
              const isCur = project.status === stage.id
              const isPast = currentStageIdx > idx
              const dot = STATUS_DOT[stage.id]
              return (
                <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}
                  onClick={() => { setActiveStage(stage.id as StageId); setExpandedStages(prev => new Set([...prev, stage.id])); const el = document.querySelector(`[data-stage="${stage.id}"]`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                  <span style={{ fontSize: 12 }}>{stage.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 11, color: isCur ? dot : isPast ? '#10B981' : '#9CA3AF', fontWeight: isCur ? 700 : 400 }}>{stage.label}</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{pct}%</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(27,42,74,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10B981' : isCur ? dot : 'rgba(27,42,74,0.15)', borderRadius: 100 }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Notes */}
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#5A6A7A', marginBottom: 12 }}>Activity Log</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                style={{ flex: 1, padding: '8px 10px', border: '1px solid rgba(27,42,74,0.12)', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none' }} />
              <button onClick={addNote} disabled={saving || !noteText.trim()}
                style={{ padding: '8px 10px', background: '#D4A84B', color: '#1B2A4A', border: 'none', borderRadius: 8, cursor: saving || !noteText.trim() ? 'not-allowed' : 'pointer', opacity: !noteText.trim() ? 0.4 : 1 }}>
                <Plus size={14} />
              </button>
            </div>
            {notes.map(n => (
              <div key={n.id} style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.08)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <p style={{ fontSize: 13, color: '#1B2A4A', margin: 0, lineHeight: 1.5, flex: 1 }}>{n.body}</p>
                  <button onClick={() => deleteNote(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
                    <Trash2 size={11} color="#9CA3AF" />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  {n.stage && (
                    <span style={{ fontSize: 10, color: STATUS_DOT[n.stage] ?? '#9CA3AF', fontWeight: 500 }}>{STATUS_LABELS[n.stage] ?? n.stage}</span>
                  )}
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>
                    {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {new Date(n.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {notes.length === 0 && <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>No notes yet.</p>}
          </div>
        </div>
      </div>

      <style>{`
        .pipeline-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
        }
        @media (max-width: 900px) {
          .pipeline-layout {
            grid-template-columns: 1fr !important;
            height: auto !important;
            overflow: visible !important;
          }
          .pipeline-layout > div:last-child {
            border-left: none !important;
            border-top: 1px solid rgba(27,42,74,0.08) !important;
          }
        }
      `}</style>
    </div>
  )
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
      <div>{children}</div>
    </div>
  )
}
