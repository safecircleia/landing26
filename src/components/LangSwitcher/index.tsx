import Link from 'next/link'
import { useRouter } from 'next/router'

export function LanguageSwitcher() {
  const router = useRouter()

  return (
    <div>
      <Link href={router.asPath} locale="en">
        English
      </Link>
      <Link href={router.asPath} locale="es">
        Spanish
      </Link>
    </div>
  )
}
