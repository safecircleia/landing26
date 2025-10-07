import type { Metadata } from 'next/types'
import type { TypedLocale } from 'payload'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { PartnerDirectory } from '@components/PartnerDirectory'
import { PartnerGrid } from '@components/PartnerGrid'
import { RenderBlocks } from '@components/RenderBlocks'
import { fetchFilters, fetchPartnerProgram, fetchPartners } from '@data'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import classes from './index.module.scss'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: TypedLocale }>
}): Promise<Metadata> {
  const { locale = 'en' } = await params
  const t = await getTranslations({ locale })

  return {
    description: t('connect-with-expert'),
    title: t('find-safecircle-partner'),
  }
}

export default async function Partners({
  params,
}: {
  params: Promise<{
    locale: TypedLocale
  }>
}) {
  const { locale = 'en' } = await params
  const { isEnabled: draft } = await draftMode()

  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  const getPartnerProgram = draft
    ? () => fetchPartnerProgram(locale)
    : unstable_cache(() => fetchPartnerProgram(locale), [`partnerProgram-${locale}`])
  const partnerProgram = await getPartnerProgram()

  if (!partnerProgram) {
    return notFound()
  }
  const { contentBlocks, featuredPartners } = partnerProgram

  const getPartners = draft
    ? () => fetchPartners(locale)
    : unstable_cache(() => fetchPartners(locale), [`partners-${locale}`])
  const partners = await getPartners()
  const partnerList = partners.map((partner) => {
    return {
      ...partner,
      budgets: partner.budgets
        .map((budget) => typeof budget !== 'string' && budget.value)
        .filter((value): value is string => !!value),
      industries: partner.industries
        .map((industry) => typeof industry !== 'string' && industry.value)
        .filter((value): value is string => !!value),
      regions: partner.regions
        .map((region) => typeof region !== 'string' && region.value)
        .filter((value): value is string => !!value),
      specialties: partner.specialties
        .map((specialty) => typeof specialty !== 'string' && specialty.value)
        .filter((value): value is string => !!value),
    }
  })

  const getFilters = draft
    ? () => fetchFilters(locale)
    : unstable_cache(() => fetchFilters(locale), [`filters-${locale}`])
  const filters = await getFilters()

  const filterOptions = {
    budgets: filters.budgets.filter((budget) => {
      return partnerList.some((partner) => partner.budgets.includes(budget.value))
    }),
    industries: filters.industries.filter((industry) => {
      return partnerList.some((partner) => partner.industries.includes(industry.value))
    }),
    regions: filters.regions.filter((region) => {
      return partnerList.some((partner) => partner.regions.includes(region.value))
    }),
    specialties: filters.specialties.filter((specialty) => {
      return partnerList.some((partner) => partner.specialties.includes(specialty.value))
    }),
  }

  return (
    <BlockWrapper settings={{}}>
      <BreadcrumbsBar
        breadcrumbs={[
          {
            label: t('agency-partners'),
          },
        ]}
        links={[
          {
            label: t('become-a-partner'),
            url: `/${locale}/partners`,
          },
        ]}
      />
      <Gutter className={[classes.hero, 'grid'].join(' ')}>
        {featuredPartners && (
          <div className={[classes.featuredPartnersWrapper, 'cols-16'].join(' ')}>
            <div className={[classes.featuredPartnersHeader, 'cols-16 grid'].join(' ')}>
              <h2 className="cols-12 cols-m-8">{t('featured-partners')}</h2>
              <p className="cols-4 start-13 cols-m-8 start-m-1">{featuredPartners.description}</p>
            </div>
            <PartnerGrid featured partners={featuredPartners.partners} />
          </div>
        )}
        <BackgroundGrid />
      </Gutter>
      {contentBlocks?.beforeDirectory && <RenderBlocks blocks={contentBlocks?.beforeDirectory} />}
      <PartnerDirectory filterOptions={filterOptions} partnerList={partnerList} />
      {contentBlocks?.afterDirectory && <RenderBlocks blocks={contentBlocks?.afterDirectory} />}
    </BlockWrapper>
  )
}
