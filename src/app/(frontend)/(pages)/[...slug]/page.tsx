import type { Media, Page as PageType } from '@root/payload-types'
import type { Metadata } from 'next'
import type { TypedLocale } from 'payload'

import { Hero } from '@components/Hero/index'
import { PayloadRedirects } from '@components/PayloadRedirects'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave'
import { RenderBlocks } from '@components/RenderBlocks/index'
import { fetchPages } from '@data'
import configPromise from '@payload-config'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'

type Args = {
  params: Promise<{
    locale: TypedLocale
    slug?: string[]
  }>
}

const Page = async ({ params: paramsPromise }: Args) => {
  const { slug, locale = 'en' } = await paramsPromise
  const url = '/' + (Array.isArray(slug) ? slug.join('/') : (slug ?? ''))

  const page = await queryPage({
    slug: slug ?? [],
    locale,
  })

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

  return pages
    .filter(({ breadcrumbs }) => breadcrumbs && breadcrumbs.length > 0)
    .map(({ breadcrumbs }) => {
      const url = breadcrumbs?.[breadcrumbs.length - 1]?.url
      const slug = url
        ?.replace(/^\/|\/$/g, '')
        .split('/')
        .filter(Boolean)
      return {
        slug: slug && slug.length > 0 ? slug : ['home'],
      }
    })
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale = 'en' } = await params
  const page = await queryPage({
    slug: slug ?? [],
    locale,
  })

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

const queryPage = cache(
  async ({ slug, locale }: { locale: TypedLocale; slug: string[] }): Promise<null | PageType> => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const slugSegments = slug || ['home']
    const slugValue = slugSegments.at(-1)

    const result = await payload.find({
      collection: 'pages',
      depth: 2,
      draft,
      limit: 1,
      locale, locale,
      overrideAccess: draft,
      where: {
        and: [
          {
            slug: {
              equals: slugValue,
            },
          },
          ...(draft
            ? []
            : [
                {
                  _status: {
                    equals: 'published',
                  },
                },
              ]),
        ],
      },
    })

    const pagePath = `/${slugSegments.join('/')}`

    const page = result.docs.find(({ breadcrumbs }: PageType) => {
      if (!breadcrumbs) {
        return false
      }
      const { url } = breadcrumbs[breadcrumbs.length - 1]
      return url === pagePath
    })

    return page || null
  },
)
