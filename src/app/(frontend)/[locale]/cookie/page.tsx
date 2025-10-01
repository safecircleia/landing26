import type { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React from 'react'

import { CookieClientPage } from './client_page'

export default (props) => {
  return <CookieClientPage {...props} />
}

export const metadata: Metadata = {
  description: 'SafeCircle Cookie Policy',
  openGraph: mergeOpenGraph({
    title: 'Cookie Policy | SafeCircle',
    url: '/cookie',
  }),
  title: 'Cookie Policy | SafeCircle',
}
