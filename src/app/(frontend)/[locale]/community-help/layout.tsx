import type { Metadata } from 'next'

export const metadata: Metadata = {
  description:
    'Find what you need faster. The SafeCircle Community Help archive is a great place to start.',
  title: {
    absolute: 'Community Help | SafeCircle',
    template: '%s | Community Help | SafeCircle',
  },
}

export default async ({ children }) => {
  return <>{children}</>
}
