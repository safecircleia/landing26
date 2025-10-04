import type { TypedLocale } from 'payload'

import { Archive } from '@components/Archive'
import { fetchArchive, fetchArchives } from '@data'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import React from 'react'

export default async ({
  params,
}: {
  params: Promise<{
    category: string
    locale: TypedLocale
  }>
}) => {
  const { category, locale = 'en' } = await params
  const { isEnabled: draft } = await draftMode()

  setRequestLocale(locale)

  const archive = draft
    ? await fetchArchive(category, draft, locale)
    : await unstable_cache(fetchArchive, [`${category}-archive-${locale}`])(category, draft, locale)

  const posts = archive?.posts?.docs

  if (!archive || !posts) {
    notFound()
  }

  return <Archive category={category} locale={locale} />
}

export const generateStaticParams = async () => {
  const locales = ['en', 'es', 'fr'] as const
  const allParams: {
    category: string
    locale: 'en' | 'es' | 'fr'
  }[] = []

  for (const locale of locales) {
    const archives = await fetchArchives(undefined, locale)
    const localeParams = archives
      .map((archive) => ({
        category: archive.slug || '',
        locale,
      }))
      .filter((param) => param.category)

    allParams.push(...localeParams)
  }

  return allParams
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    category: string
    locale: TypedLocale
  }>
}) => {
  const { category, locale = 'en' } = await params
  const archive = await fetchArchive(category, false, locale)

  if (!archive) {
    return null
  }

  const { name, description } = archive

  return {
    description,
    title: `${name} | SafeCircle`,
  }
}
