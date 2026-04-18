'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const GA4_ID = 'G-7CEGSQ3TGS'
const GA_ID = 'AW-18063310136'

export default function AnalyticsLoader() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    const check = () => setConsented(localStorage.getItem('cookie-consent') === 'accepted')
    check()
    // Listen for consent changes from CookieBanner
    window.addEventListener('cookie-consent-change', check)
    return () => window.removeEventListener('cookie-consent-change', check)
  }, [])

  if (!consented) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
