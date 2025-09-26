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
    <Script
      data-website-id="56bc82f8-7a54-4555-a9d9-4ee36bbbfe4c"
      defer
      src="https://analytics.tomasps.com/script.js"
    />
  )
}
