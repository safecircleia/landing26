import type { Metadata } from 'next'

import { GoogleTagManager } from '@components/Analytics/GoogleTagManager/index'
import { UmamiAnalytics } from '@components/Analytics/UmamiAnalytics/index'
import { PrivacyBanner } from '@components/PrivacyBanner/index'
import { Providers } from '@providers/index'
import { PrivacyProvider } from '@root/providers/Privacy/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { GeistMono } from 'geist/font/mono'
import React from 'react'

import { untitledSans } from './fonts'
import '../../css/app.scss'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <PrivacyProvider>
        <head>
          <link href="/images/favicon.svg" rel="icon" />
          <link href={process.env.NEXT_PUBLIC_CLOUD_CMS_URL} rel="dns-prefetch" />
          <link href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" rel="stylesheet" />
          <link href="https://analytics.tomasps.com" rel="preconnect" />
          <UmamiAnalytics />
        </head>
        <body className={[GeistMono.variable, untitledSans.variable].join(' ')}>
          <GoogleTagManager />
          <Providers>
            {children}
            <PrivacyBanner />
          </Providers>
        </body>
      </PrivacyProvider>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://payloadcms.com'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@toomas_ps',
  },
}
