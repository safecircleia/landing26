import type { Media } from '@root/payload-types'
import type { Metadata } from 'next'
import type { TypedLocale } from 'payload'

import { Hero } from '@components/Hero/index'
import { PayloadRedirects } from '@components/PayloadRedirects'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave'
import { RenderBlocks } from '@components/RenderBlocks/index'
import { fetchPage, fetchPages } from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import React from 'react'

// Alternative approach using getPayload directly:
// import { getPayload } from 'payload'
// const payload = await getPayload()
// const { docs: [data] } = await payload.find({
//   collection: "pages",
//   where: { slug: "learn" },
//   locale: lang,
// })

const getPage = async (slug: string[] | undefined, locale: TypedLocale, draft?: boolean) => {
  const slugPath = slug && Array.isArray(slug) ? slug.join('/') : 'home'
  const slugParam = slug || ['home']
  return draft
    ? fetchPage(slugParam, locale)
    : unstable_cache(fetchPage, [`page-${slugPath}-${locale}`])(slugParam, locale)
}

const Page = async ({
  params,
}: {
  params: Promise<{
    locale: string
    slug?: string[]
  }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const { slug, locale } = await params
  const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug || '')

  const page = await getPage(slug, locale as TypedLocale, draft)

  // Alternative: Query for a specific page directly using getPayload
  // const payload = await getPayload({ config })
  // const { docs: [data] } = await payload.find({
  //   collection: "pages",
  //   where: { slug: "your-specific-slug" },
  //   locale: lang as TypedLocale,
  // })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <React.Fragment>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <Hero firstContentBlock={page.layout[0]} page={page} />
      <RenderBlocks blocks={page.layout} hero={page.hero} />
    </React.Fragment>
  )
}

export default Page

export async function generateStaticParams() {
  const getPages = unstable_cache(fetchPages, ['pages'])
  const pages = await getPages()

  return pages.map(({ breadcrumbs }) => ({
    slug: breadcrumbs?.[breadcrumbs.length - 1]?.url?.replace(/^\/|\/$/g, '').split('/'),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string
    slug?: string[]
  }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const { isEnabled: draft } = await draftMode()
  const page = await getPage(slug, locale as TypedLocale, draft)

  let ogImage: Media | null = null

  if (page && page.meta?.image && typeof page.meta.image !== 'string') {
    ogImage = page.meta.image
  }

  // check if noIndex is true
  const noIndexMeta = page?.noindex ? { robots: 'noindex' } : {}

  return {
    description: page?.meta?.description,
    openGraph: mergeOpenGraph({
      description: page?.meta?.description ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage.url as string,
            },
          ]
        : undefined,
      title: page?.meta?.title || 'Safecircle',
      url: Array.isArray(slug) ? slug.join('/') : '/',
    }),
    title: page?.meta?.title || 'Safecircle',
    ...noIndexMeta, // Add noindex meta tag if noindex is true
  }
}
