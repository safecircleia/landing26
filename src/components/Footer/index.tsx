'use client'

import type { Theme } from '@root/providers/Theme/types'
import type { Footer as FooterType } from '@types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { LanguageSwitcher } from '@components/LanguageSwitcher/index'
import { NewsletterSignUp } from '@components/NewsletterSignUp'
import Payload3D from '@components/Payload3D/index'
import { DiscordIcon } from '@root/graphics/DiscordIcon/index'
import { InstagramIcon } from '@root/graphics/InstagramIcon/index'
import { ThemeAutoIcon } from '@root/graphics/ThemeAutoIcon/index'
import { ThemeDarkIcon } from '@root/graphics/ThemeDarkIcon/index'
import { ThemeLightIcon } from '@root/graphics/ThemeLightIcon/index'
import { TwitterIconAlt } from '@root/graphics/TwitterIconAlt/index'
import { YoutubeIcon } from '@root/graphics/YoutubeIcon/index'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon/index'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index'
import { useThemePreference } from '@root/providers/Theme/index'
import { getImplicitPreference, themeLocalStorageKey } from '@root/providers/Theme/shared'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useId } from 'react'

import classes from './index.module.scss'

export const Footer: React.FC<FooterType> = (props) => {
  const { columns } = props
  const [products, developers, company] = columns ?? []
  const { setTheme } = useThemePreference()
  const { setHeaderTheme } = useHeaderObserver()
  const t = useTranslations()
  const wrapperRef = React.useRef<HTMLElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const onThemeChange = (themeToSet: 'auto' & Theme) => {
    if (themeToSet === 'auto') {
      const implicitPreference = getImplicitPreference() ?? 'light'
      setHeaderTheme(implicitPreference)
      setTheme(implicitPreference)
      if (selectRef.current) {
        selectRef.current.value = 'auto'
      }
    } else {
      setTheme(themeToSet)
      setHeaderTheme(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (selectRef.current) {
      selectRef.current.value = preference ?? 'auto'
    }
  }, [])

  const pathname = usePathname()

  const allowedSegments = [
    'cloud',
    'cloud-terms',
    'forgot-password',
    'join-team',
    'login',
    'logout',
    'new',
    'reset-password',
    'verify',
    'signup',
  ]

  const pathnameSegments = pathname.split('/').filter(Boolean)
  const isCloudPage = pathnameSegments.some((segment) => allowedSegments.includes(segment))

  const themeId = useId()

  return (
    <footer className={classes.footer} data-theme="dark" ref={wrapperRef}>
      <BackgroundGrid
        className={[classes.background, isCloudPage ? classes.topBorder : '']
          .filter(Boolean)
          .join(' ')}
        zIndex={2}
      />
      <Gutter className={classes.container}>
        <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')}>
          <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>{products?.label}</p>
            <div className={classes.colItems}>
              {products?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>{developers?.label}</p>
            <div className={classes.colItems}>
              {developers?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>{company?.label}</p>
            <div className={classes.colItems}>
              {company?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={`${classes.colHeader} ${classes.thirdColumn}`}>{t('stay-connected')}</p>
            <NewsletterSignUp />

            <div className={classes.socialLinks}>
              <a
                aria-label="SafeCircle's Twitter page"
                className={`${classes.socialIconLink} ${classes.twitterIcon}`}
                href="https://twitter.com/safecircleai"
                rel="noopener noreferrer"
                target="_blank"
              >
                <TwitterIconAlt />
              </a>
              <a
                aria-label="SafeCircle's Discord"
                className={classes.socialIconLink}
                href="https://discord.gg/y53baqbgzV"
                rel="noopener noreferrer"
                target="_blank"
              >
                <DiscordIcon />
              </a>
              <a
                aria-label="SafeCircle's YouTube channel"
                className={classes.socialIconLink}
                href="https://www.youtube.com/@SafeCircleai"
                rel="noopener noreferrer"
                target="_blank"
              >
                <YoutubeIcon />
              </a>
              <a
                aria-label="SafeCircle's Instagram page"
                className={classes.socialIconLink}
                href="https://www.instagram.com/safecircleai/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <InstagramIcon />
              </a>
            </div>

            <div className={classes.selectContainer}>
              <label className="visually-hidden" htmlFor={themeId}>
                Switch themes
              </label>
              {selectRef?.current && (
                <div className={`${classes.switcherIcon} ${classes.themeIcon}`}>
                  {selectRef.current.value === 'auto' && <ThemeAutoIcon />}
                  {selectRef.current.value === 'light' && <ThemeLightIcon />}
                  {selectRef.current.value === 'dark' && <ThemeDarkIcon />}
                </div>
              )}

              <select
                id={themeId}
                onChange={(e) => onThemeChange(e.target.value as 'auto' & Theme)}
                ref={selectRef}
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>

              <ChevronUpDownIcon
                className={`${classes.switcherIcon} ${classes.upDownChevronIcon}`}
              />
            </div>

            <LanguageSwitcher />
          </div>
        </div>
      </Gutter>
      <Gutter className={classes.payload3dContainer}>
        <Payload3D />
      </Gutter>
    </footer>
  )
}
