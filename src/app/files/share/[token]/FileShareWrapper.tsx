'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const FileShareClient = dynamic(() => import('./FileShareClient'), { ssr: false })

export default function FileShareWrapper() {
  const params = useParams()
  const token = params.token as string
  return <FileShareClient token={token} />
}
