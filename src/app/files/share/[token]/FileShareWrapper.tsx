'use client'

import dynamic from 'next/dynamic'

const FileShareClient = dynamic(() => import('./FileShareClient'), { ssr: false })

export default function FileShareWrapper({ token }: { token: string }) {
  return <FileShareClient token={token} />
}
