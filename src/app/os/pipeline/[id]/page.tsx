import type { Metadata } from 'next'
import ProjectPipelineClient from './ProjectPipelineClient'

export const metadata: Metadata = { title: 'Project Pipeline — Business OS' }
export default function ProjectPipelinePage({ params }: { params: { id: string } }) {
  return <ProjectPipelineClient projectId={params.id} />
}
