'use client'

import { usePathname } from 'next/navigation'

export const usePathnameSegments = (): string[] => {
  let pathname = usePathname()

  if (!pathname || pathname === '/') {
    return []
  }

  pathname = pathname[0] === '/' ? pathname.slice(1) : pathname
  pathname = pathname[pathname.length - 1] === '/' ? pathname.slice(0, -1) : pathname

  return pathname.split('/')
}
