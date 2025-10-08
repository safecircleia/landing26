import type { TypedLocale } from 'payload'

import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import type {
  Budget,
  CaseStudy,
  Category,
  Footer,
  Form,
  GetStarted,
  Industry,
  MainMenu,
  Page,
  Partner,
  PartnerProgram,
  Post,
  Region,
  Specialty,
  TopBar,
} from '../../payload-types'

export const fetchGlobals = async (
  locale: TypedLocale = 'en',
): Promise<{
  footer: Footer
  i18n: {
    activeLocale: TypedLocale
    availableLocales: TypedLocale[]
  }
  mainMenu: MainMenu
  topBar: TopBar
}> => {
  const payload = await getPayload({ config })
  const availableLocales = ['en', 'es', 'fr'] as TypedLocale[]
  const mainMenu = await payload.findGlobal({
    slug: 'main-menu',
    depth: 1,
    locale,
  })
  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
    locale,
  })
  const topBar = await payload.findGlobal({
    slug: 'topBar',
    depth: 1,
    locale,
  })

  return {
    footer,
    i18n: {
      activeLocale: locale,
      availableLocales,
    },
    mainMenu,
    topBar,
  }
}

// helper: get available locales without fetching globals
export const getAvailableLocales = (): TypedLocale[] => ['en', 'es', 'fr'] as TypedLocale[]

export const fetchPage = async (
  incomingSlugSegments: string | string[],
  locale: TypedLocale = 'en',
): Promise<null | Page> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const slugSegments = Array.isArray(incomingSlugSegments)
    ? incomingSlugSegments
    : incomingSlugSegments
      ? [incomingSlugSegments]
      : ['home']
  const slug = slugSegments[slugSegments.length - 1]

  const data = await payload.find({
    collection: 'pages',
    depth: 3,
    draft,
    limit: 1,
    locale, // added
    where: {
      and: [
        {
          slug: {
            equals: slug,
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

  const page = data.docs.find(({ breadcrumbs }: Page) => {
    if (!breadcrumbs || breadcrumbs.length === 0) {
      return false
    }
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]
    if (!lastBreadcrumb || !lastBreadcrumb.url) {
      return false
    }
    const { url } = lastBreadcrumb
    // Match both with and without locale prefix
    return (
      url === pagePath ||
      url === `/${locale}${pagePath}` ||
      url === pagePath.replace(`/${locale}`, '')
    )
  })

  if (page) {
    return page
  }

  // If no page found through breadcrumbs matching, try to find by slug directly
  // This is a fallback for pages that might not have proper breadcrumbs set up
  const fallbackPage = data.docs.find(({ slug: pageSlug }: Page) => pageSlug === slug)

  return fallbackPage || null
}

export const fetchPages = async (locale: TypedLocale = 'en'): Promise<Partial<Page>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 300,
    locale, // added
    select: {
      breadcrumbs: true,
    },
    where: {
      and: [
        {
          slug: {
            not_equals: 'cloud',
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return data.docs
}

export const fetchPosts = async (locale: TypedLocale = 'en'): Promise<Partial<Post>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 300,
    locale, // added
    select: {
      slug: true,
      category: true,
    },
  })

  return data.docs
}

export const fetchBlogPosts = async (locale: TypedLocale = 'en'): Promise<Partial<Post>[]> => {
  const currentDate = new Date()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 300,
    locale, // added
    select: {
      slug: true,
      authors: true,
      image: true,
      publishedOn: true,
      title: true,
    },
    sort: '-publishedOn',
    where: {
      and: [
        { publishedOn: { less_than_equal: currentDate } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  return data.docs
}

export const fetchArchive = async (
  slug: string,
  draft?: boolean,
  locale: TypedLocale = 'en',
): Promise<Partial<Category>> => {
  const payload = await getPayload({ config })
  const currentDate = new Date()

  // First, get the category
  const categoryData = await payload.find({
    collection: 'categories',
    depth: 0,
    draft,
    limit: 1,
    locale,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      headline: true,
    },
    where: {
      and: [{ slug: { equals: slug } }],
    },
  })

  const category = categoryData.docs[0]
  if (!category) {
    return {}
  }

  // Then, fetch posts for this category
  const postsData = await payload.find({
    collection: 'posts',
    depth: 2,
    draft,
    locale,
    sort: '-publishedOn',
    where: {
      and: [
        { category: { equals: category.id } },
        { publishedOn: { less_than_equal: currentDate } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  return {
    ...category,
    posts: { docs: postsData.docs },
  }
}

export const fetchArchives = async (
  slug?: string,
  locale: TypedLocale = 'en',
): Promise<Partial<Category>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'categories',
    depth: 0,
    locale, // added
    select: {
      name: true,
      slug: true,
    },
    sort: 'name',
    ...(slug && {
      where: {
        slug: {
          not_equals: slug,
        },
      },
    }),
  })

  return data.docs
}

export const fetchBlogPost = async (
  slug: string,
  category,
  locale: TypedLocale = 'en',
): Promise<Partial<Post>> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'posts',
    depth: 2,
    draft,
    limit: 1,
    locale, // added
    select: {
      authors: true,
      authorType: true,
      category: true,
      content: true,
      excerpt: true,
      featuredMedia: true,
      guestAuthor: true,
      guestSocials: true,
      image: true,
      meta: true,
      publishedOn: true,
      relatedPosts: true,
      title: true,
      videoUrl: true,
    },
    where: {
      and: [
        { slug: { equals: slug } },
        { 'category.slug': { equals: category } },
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

  return data.docs[0]
}

export const fetchCaseStudies = async (
  locale: TypedLocale = 'en',
): Promise<Partial<CaseStudy>[]> => {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 300,
    locale, // added
    select: {
      slug: true,
    },
  })

  return data.docs
}

export const fetchCaseStudy = async (
  slug: string,
  locale: TypedLocale = 'en',
): Promise<CaseStudy> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft,
    limit: 1,
    locale, // added
    where: {
      and: [
        { slug: { equals: slug } },
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

  return data.docs[0]
}

export const fetchPartners = async (locale: TypedLocale = 'en'): Promise<Partner[]> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'partners',
    depth: 2,
    limit: 300,
    locale, // added
    sort: 'slug',
    where: {
      AND: [{ agency_status: { equals: 'active' } }, { _status: { equals: 'published' } }],
    },
  })

  return data.docs
}

export const fetchPartner = async (
  slug: string,
  locale: TypedLocale = 'en',
): Promise<Partial<Partner>> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'partners',
    depth: 2,
    draft,
    limit: 1,
    locale, // added
    populate: {
      'case-studies': {
        slug: true,
        featuredImage: true,
        meta: {
          description: true,
        },
        title: true,
      },
    },
    select: {
      name: true,
      budgets: true,
      city: true,
      content: {
        bannerImage: true,
        caseStudy: true,
        contributions: true,
        idealProject: true,
        overview: true,
        projects: true,
        services: true,
      },
      email: true,
      featured: true,
      industries: true,
      regions: true,
      social: true,
      specialties: true,
      topContributor: true,
      website: true,
    },
    where: {
      and: [
        { slug: { equals: slug } },
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

  return data.docs[0]
}

export const fetchPartnerProgram = async (
  locale: TypedLocale = 'en',
): Promise<Partial<PartnerProgram>> => {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({
    slug: 'partner-program',
    depth: 2,
    locale, // added
  })

  return data
}

export const fetchFilters = async (
  locale: TypedLocale = 'en',
): Promise<{
  budgets: Budget[]
  industries: Industry[]
  regions: Region[]
  specialties: Specialty[]
}> => {
  const payload = await getPayload({ config })
  const industries = await payload.find({
    collection: 'industries',
    limit: 100,
    locale, // added
  })
  const specialties = await payload.find({
    collection: 'specialties',
    limit: 100,
    locale, // added
  })
  const regions = await payload.find({
    collection: 'regions',
    limit: 100,
    locale, // added
  })
  const budgets = await payload.find({
    collection: 'budgets',
    limit: 100,
    locale, // added
  })

  return {
    budgets: budgets.docs,
    industries: industries.docs,
    regions: regions.docs,
    specialties: specialties.docs,
  }
}

export const fetchGetStarted = async (locale: TypedLocale = 'en'): Promise<GetStarted> => {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({
    slug: 'get-started',
    depth: 1,
    locale, // added
  })

  return data
}

export const fetchForm = async (name: string, locale: TypedLocale = 'en'): Promise<Form> => {
  const payload = await getPayload({ config })

  const data = await payload.find({
    collection: 'forms',
    depth: 1,
    limit: 1,
    locale, // added
    where: {
      title: {
        equals: name,
      },
    },
  })

  return data.docs[0]
}
