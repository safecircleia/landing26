'use client'

import { LanguageIcon } from '@root/graphics/LanguageIcon/index'
import localization from '@root/i18n/localization'
import { usePathname, useRouter } from '@root/i18n/routing'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon/index'
import { useLocale, useTranslations } from 'next-intl'
import React, { useId } from 'react'

import classes from './index.module.scss'

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const languageId = useId()
  const t = useTranslations()

  const onLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale })
  }

  return (
    <div className={classes.selectContainer}>
      <label className="visually-hidden" htmlFor={languageId}>
        {t('switch-language')}
      </label>

      <div className={`${classes.switcherIcon} ${classes.languageIcon}`}>
        <LanguageIcon />
      </div>

      <select id={languageId} onChange={(e) => onLanguageChange(e.target.value)} value={locale}>
        {localization.locales.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>

      <ChevronUpDownIcon className={`${classes.switcherIcon} ${classes.upDownChevronIcon}`} />
    </div>
  )
}
