import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'SafeCircle is a privacy-first digital safety platform designed to protect families and educational institutions online ',
  images: [
    {
      url: '/images/og-image.jpg',
    },
  ],
  siteName: 'SafeCircle',
  title: 'SafeCircle',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
