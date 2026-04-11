import type { Metadata } from 'next'
import NewProjectForm from './NewProjectForm'

export const metadata: Metadata = { title: 'New Project — Business OS' }
export default function NewProjectPage() { return <NewProjectForm /> }
