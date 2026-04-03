'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Upload, Download, Trash2, Copy, Check, FolderOpen,
  FileText, Image, Archive, File as FileIcon, X, Users,
} from 'lucide-react'
import OSPageHeader from '@/components/OSPageHeader'
import { createClient } from '@/lib/supabase'

interface Client {
  id: string
  name: string
}

interface ClientFile {
  id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  description: string | null
  uploaded_at: string
  download_count: number
  share_token: string | null
  share_expires_at: string | null
  client_id: string
  client?: { name: string }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileTypeIcon({ type }: { type: string }) {
  if (type.includes('image')) return <Image size={16} color="#3b82f6" aria-label="image file" />
  if (type.includes('pdf')) return <FileText size={16} color="#ef4444" />
  if (type.includes('zip') || type.includes('archive')) return <Archive size={16} color="#D4A84B" />
  return <FileIcon size={16} color="#5A6A7A" />
}

const ALLOWED_TYPES = ['PDF', 'PNG', 'JPG', 'GIF', 'WEBP', 'DOC', 'DOCX', 'XLS', 'XLSX', 'CSV', 'TXT', 'ZIP']

export default function FilesClient({ scopedClientId }: { scopedClientId?: string }) {
  const [clients, setClients] = useState<Client[]>([])
  const [files, setFiles] = useState<ClientFile[]>([])
  const [selectedClient, setSelectedClient] = useState<string | null>(scopedClientId || null)
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadClient, setUploadClient] = useState(scopedClientId || '')
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [userId, setUserId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const init = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)
    const { data } = await supabase.from('clients').select('id, name').order('name')
    if (data) setClients(data)
    setLoading(false)
  }

  const fetchFiles = async () => {
    const supabase = createClient()
    let q = supabase
      .from('client_files')
      .select('*, client:clients(name)')
      .order('uploaded_at', { ascending: false })
    if (selectedClient) q = q.eq('client_id', selectedClient)
    const { data } = await q
    if (data) setFiles(data as ClientFile[])
  }

  useEffect(() => { init() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (userId) fetchFiles() }, [selectedClient, userId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload() {
    if (!uploadFile || !uploadClient || !userId) return
    if (uploadFile.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB')
      return
    }
    setUploading(true)
    setUploadProgress(10)
    const supabase = createClient()
    const safeFilename = `${Date.now()}-${uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const path = `${userId}/${uploadClient}/${safeFilename}`
    const { error: storageErr } = await supabase.storage
      .from('client-files')
      .upload(path, uploadFile, { upsert: false })
    if (storageErr) {
      alert('Upload failed: ' + storageErr.message)
      setUploading(false)
      return
    }
    setUploadProgress(70)
    await supabase.from('client_files').insert({
      user_id: userId,
      client_id: uploadClient,
      file_name: uploadFile.name,
      file_path: path,
      file_size: uploadFile.size,
      file_type: uploadFile.type,
      description: uploadDesc || null,
    })
    setUploadProgress(100)
    setTimeout(() => {
      setUploading(false)
      setUploadProgress(0)
      setShowUpload(false)
      setUploadFile(null)
      setUploadDesc('')
      if (!scopedClientId) setUploadClient('')
      fetchFiles()
    }, 600)
  }

  async function handleDownload(f: ClientFile) {
    const supabase = createClient()
    const { data } = await supabase.storage.from('client-files').createSignedUrl(f.file_path, 60)
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
      await supabase.from('client_files').update({ download_count: f.download_count + 1 }).eq('id', f.id)
      fetchFiles()
    }
  }

  async function handleDelete(f: ClientFile) {
    if (!confirm(`Delete "${f.file_name}"?`)) return
    const supabase = createClient()
    await supabase.storage.from('client-files').remove([f.file_path])
    await supabase.from('client_files').delete().eq('id', f.id)
    fetchFiles()
  }

  async function copyShareLink(f: ClientFile) {
    const supabase = createClient()
    let token = f.share_token
    if (!token) {
      token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      await supabase.from('client_files').update({ share_token: token, share_expires_at: expires }).eq('id', f.id)
    }
    await navigator.clipboard.writeText(`https://nithdigital.uk/files/share/${token}`)
    setCopiedId(f.id)
    setTimeout(() => setCopiedId(null), 2500)
    fetchFiles()
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadFile(file)
  }

  const displayFiles = files

  return (
    <div>
      <OSPageHeader
        title="Files"
        description="Share files with your clients"
        action={
          <button
            onClick={() => setShowUpload(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', background: '#1B2A4A', color: '#F5F0E6',
              borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            <Upload size={14} /> Upload file
          </button>
        }
      />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left panel: client list — hidden in scoped mode */}
        {!scopedClientId && (
          <div style={{
            width: 220, flexShrink: 0, borderRight: '1px solid rgba(27,42,74,0.08)',
            background: '#fff', overflowY: 'auto',
          }}>
            <button
              onClick={() => setSelectedClient(null)}
              style={{
                width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 13,
                background: !selectedClient ? 'rgba(27,42,74,0.05)' : 'transparent',
                border: 'none', cursor: 'pointer',
                borderLeft: !selectedClient ? '3px solid #D4A84B' : '3px solid transparent',
                color: !selectedClient ? '#1B2A4A' : '#5A6A7A', fontWeight: !selectedClient ? 600 : 400,
              }}
            >
              All files
            </button>
            {clients.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedClient(c.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 13,
                  background: selectedClient === c.id ? 'rgba(27,42,74,0.05)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderLeft: selectedClient === c.id ? '3px solid #D4A84B' : '3px solid transparent',
                  color: selectedClient === c.id ? '#1B2A4A' : '#5A6A7A',
                  fontWeight: selectedClient === c.id ? 600 : 400,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <Users size={13} />
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Right panel: files */}
        <div style={{ flex: 1, padding: '20px 24px', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#5A6A7A', fontSize: 13 }}>Loading...</div>
          ) : displayFiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 32px' }}>
              <FolderOpen size={40} color="rgba(27,42,74,0.15)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: '#5A6A7A', fontSize: 14, margin: '0 0 16px' }}>No files yet</p>
              <button
                onClick={() => setShowUpload(true)}
                style={{
                  padding: '9px 20px', background: '#1B2A4A', color: '#F5F0E6',
                  borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13,
                }}
              >
                Upload a file
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                  {['File', ...(selectedClient ? [] : ['Client']), 'Size', 'Uploaded', 'Downloads', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5A6A7A', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayFiles.map((f, i) => (
                  <tr key={f.id} style={{ borderBottom: i < displayFiles.length - 1 ? '1px solid rgba(27,42,74,0.05)' : 'none' }}>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileTypeIcon type={f.file_type} />
                        <div>
                          <div style={{ fontWeight: 500, color: '#1B2A4A' }}>{f.file_name}</div>
                          {f.description && <div style={{ fontSize: 11, color: '#5A6A7A', marginTop: 2 }}>{f.description}</div>}
                        </div>
                      </div>
                    </td>
                    {!selectedClient && (
                      <td style={{ padding: '12px 12px', color: '#5A6A7A' }}>{(f as ClientFile & { client?: { name: string } }).client?.name || '—'}</td>
                    )}
                    <td style={{ padding: '12px 12px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>{formatBytes(f.file_size)}</td>
                    <td style={{ padding: '12px 12px', color: '#5A6A7A', whiteSpace: 'nowrap' }}>
                      {new Date(f.uploaded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '12px 12px', color: '#5A6A7A', textAlign: 'center' }}>{f.download_count}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleDownload(f)}
                          title="Download"
                          style={{ background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Download size={13} color="#1B2A4A" />
                        </button>
                        <button
                          onClick={() => copyShareLink(f)}
                          title="Copy share link"
                          style={{ background: 'none', border: '1px solid rgba(27,42,74,0.15)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {copiedId === f.id ? <Check size={13} color="#22c55e" /> : <Copy size={13} color="#1B2A4A" />}
                        </button>
                        <button
                          onClick={() => handleDelete(f)}
                          title="Delete"
                          style={{ background: 'none', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Trash2 size={13} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16,
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1B2A4A', margin: 0 }}>Upload File</h3>
              <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} color="#5A6A7A" />
              </button>
            </div>

            {/* Client selector */}
            {!scopedClientId && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 6 }}>Client *</label>
                <select
                  value={uploadClient}
                  onChange={e => setUploadClient(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 13, color: '#1B2A4A' }}
                >
                  <option value="">Select a client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#D4A84B' : 'rgba(27,42,74,0.2)'}`,
                borderRadius: 8, padding: '28px 20px', textAlign: 'center',
                cursor: 'pointer', marginBottom: 16, background: dragOver ? 'rgba(212,168,75,0.04)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <Upload size={24} color={dragOver ? '#D4A84B' : 'rgba(27,42,74,0.3)'} style={{ margin: '0 auto 8px', display: 'block' }} />
              {uploadFile ? (
                <p style={{ fontSize: 13, color: '#1B2A4A', margin: 0 }}>
                  <strong>{uploadFile.name}</strong> ({formatBytes(uploadFile.size)})
                </p>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: '#1B2A4A', margin: '0 0 4px', fontWeight: 500 }}>Drop a file here, or click to browse</p>
                  <p style={{ fontSize: 11, color: '#5A6A7A', margin: 0 }}>Max 10MB · {ALLOWED_TYPES.join(', ')}</p>
                </>
              )}
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => setUploadFile(e.target.files?.[0] || null)} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A', display: 'block', marginBottom: 6 }}>Description (optional)</label>
              <input
                type="text"
                value={uploadDesc}
                onChange={e => setUploadDesc(e.target.value)}
                placeholder="e.g. Website proposal v2"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, fontSize: 13, color: '#1B2A4A', boxSizing: 'border-box' }}
              />
            </div>

            {/* Progress */}
            {uploading && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ height: 4, background: 'rgba(27,42,74,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${uploadProgress}%`, background: '#D4A84B', transition: 'width 0.3s', borderRadius: 2 }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUpload(false)}
                style={{ padding: '9px 20px', background: 'none', border: '1px solid rgba(27,42,74,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#5A6A7A' }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFile || !uploadClient || uploading}
                style={{
                  padding: '9px 20px', background: '#1B2A4A', color: '#F5F0E6',
                  borderRadius: 6, border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 500, opacity: (!uploadFile || !uploadClient || uploading) ? 0.5 : 1,
                }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
