import type { Metadata } from 'next'
import type { TypedLocale } from 'payload'

import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index'
import { PayloadRedirects } from '@components/PayloadRedirects/index'
import { Post } from '@components/Post/index'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index'
import { fetchBlogPost, fetchPosts } from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import React from 'react'

const getPost = async (slug, category, locale: TypedLocale = 'en', draft?) =>
  draft
    ? await fetchBlogPost(slug, category, locale)
    : await unstable_cache(fetchBlogPost, ['blogPost', `post-${slug}-${locale}`])(
        slug,
        category,
        locale,
      )

const PostPage = async ({
  params,
}: {
  params: Promise<{
    category: string
    locale: TypedLocale
    slug: string
  }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const { slug, category, locale = 'en' } = await params

  setRequestLocale(locale)
  const blogPost = await getPost(slug, category, locale, draft)

  const url = `/${category}/${slug}`

  if (!blogPost) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <BreadcrumbsBar breadcrumbs={[]} hero={{ type: 'default' }} />
      <Post {...blogPost} />
    </>
  )
}

export default PostPage

export async function generateStaticParams() {
  const locales = ['en', 'es', 'fr'] as const
  const allParams: {
    category: string
    locale: 'en' | 'es' | 'fr'
    slug: string
  }[] = []

  for (const locale of locales) {
    const getPosts = unstable_cache(fetchPosts, ['allPosts', locale])
    const posts = await getPosts(locale)

    const localeParams = posts
      .map(({ slug, category }) => {
        if (!category || typeof category === 'string' || !category.slug || !slug) {
          return null
        }

        return {
          slug,
          category: category.slug,
          locale,
        }
      })
      .filter((param): param is NonNullable<typeof param> => param !== null)

    allParams.push(...localeParams)
  }

  return allParams
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string
    locale: TypedLocale
    slug: string
  }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug, category, locale = 'en' } = await params
  const post = await getPost(slug, category, locale, draft)

  let ogImage: null | string = null

  if (post) {
    if (post?.meta?.image && typeof post.meta.image !== 'string' && post.meta.image?.url) {
      ogImage = post.meta.image.url
    } else if (
      post.featuredMedia === 'upload' &&
      post.image &&
      typeof post.image !== 'string' &&
      post.image?.url
    ) {
      ogImage = post.image.url
    } else if (post.featuredMedia === 'videoUrl' && post.videoUrl) {
      ogImage = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?type=${category}&title=${post.title}`
    }
  }

  return {
    description: post?.meta?.description,
    openGraph: mergeOpenGraph({
      description: post?.meta?.description ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: post?.meta?.title ?? undefined,
      url: `/${category}/${slug}`,
    }),
    title: post?.meta?.title ?? post?.title ?? undefined,
  }
}
