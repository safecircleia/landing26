import type { TypedLocale } from 'payload'

import { Footer } from '@components/Footer/index'
import { Header } from '@components/Header/index'
import { TopBar } from '@components/TopBar'
import { fetchGlobals } from '@data/index'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import React from 'react'
export const dynamic = 'force-static'
import { getMessages, setRequestLocale } from 'next-intl/server'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: TypedLocale }>
}) {
  const { isEnabled: draft } = await draftMode()
  const { locale } = await params

  const getGlobals = draft
    ? fetchGlobals
    : unstable_cache(fetchGlobals, ['globals', 'mainMenu', 'footer', locale])

  setRequestLocale(locale)
  const messages = await getMessages()

  const { footer, mainMenu, topBar } = await getGlobals(locale)

  return (
    <React.Fragment>
      <NextIntlClientProvider messages={messages}>
        <Header {...mainMenu}>{topBar.enableTopBar && <TopBar {...topBar} />}</Header>
        <div>
          {children}
          <div id="docsearch" />
          <Footer {...footer} />
        </div>
      </NextIntlClientProvider>
    </React.Fragment>
  )
}
