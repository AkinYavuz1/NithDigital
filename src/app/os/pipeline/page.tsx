import type { Metadata } from 'next'
import PipelineClient from './PipelineClient'

export const metadata: Metadata = { title: 'Projects — Business OS' }
export default function PipelinePage() { return <PipelineClient /> }
