'use client'

import { usePrivacy } from '@root/providers/Privacy/index'
import Script from 'next/script'
import * as React from 'react'

export const UmamiAnalytics: React.FC = () => {
  const { cookieConsent } = usePrivacy()

  if (!cookieConsent) {
    return null
  }

  return (
    <script
      data-site-id="05b59147cf14"
      defer
      src="https://analytics.tomasps.com/api/script.js"
    ></script>
  )
}
