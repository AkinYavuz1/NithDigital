import type { Metadata } from 'next'
import NotificationsClient from './NotificationsClient'
export const metadata: Metadata = { title: 'Notifications — Business OS' }
export default function NotificationsPage() { return <NotificationsClient /> }
