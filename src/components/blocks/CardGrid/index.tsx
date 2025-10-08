'use client'

import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'
import type { CSSProperties } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { SquareCard } from '@components/cards/SquareCard/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import React from 'react'

import classes from './index.module.scss'

export type CardGridProps = {
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'cardGrid' }>

export const CardGrid: React.FC<CardGridProps> = (props) => {
  const { cardGridFields, hideBackground, padding } = props

  // Early return if cardGridFields is missing
  if (!cardGridFields) {
    return null
  }

  // Safely destructure with fallbacks
  const rawCards = cardGridFields.cards ?? []
  const links = cardGridFields.links ?? []
  const revealDescription = cardGridFields.revealDescription ?? false
  const richText = cardGridFields.richText
  const settings = cardGridFields.settings

  // Filter out null/undefined cards
  const cards = Array.isArray(rawCards) ? rawCards.filter((card) => card != null) : []

  const cardLength = cards.length
  const hasCards = cardLength > 0
  const hasLinks = Array.isArray(links) && links.length > 0
  const excessLength = cardLength > 4 ? 8 - cardLength : 4 - cardLength

  const wrapperStyle: CSSProperties = {
    '--excess-length-large': excessLength,
    '--excess-length-mid': cardLength % 2 === 0 ? 0 : 1,
  } as CSSProperties

  return (
    <BlockWrapper
      className={[classes.cardGrid].filter(Boolean).join(' ')}
      hideBackground={hideBackground}
      padding={{ ...padding, top: 'large' }}
      settings={settings}
    >
      <BackgroundGrid zIndex={1} />
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {richText && (
            <div className={[classes.richTextWrapper, 'grid'].filter(Boolean).join(' ')}>
              <div className={[classes.richText, 'cols-10 cols-m-8'].filter(Boolean).join(' ')}>
                <RichText content={richText} />
              </div>
              {hasLinks && (
                <div
                  className={[classes.linksWrapper, 'cols-4 start-13 cols-l-4 cols-m-8 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {links.map(({ link }, index) => {
                    return (
                      <CMSLink
                        {...link}
                        appearance="default"
                        buttonProps={{
                          hideBottomBorderExceptLast: true,
                          hideHorizontalBorders: true,
                          icon: 'arrow',
                        }}
                        fullWidth
                        key={index}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            <div className={classes.margins}>
              <BackgroundScanline className={classes.marginLeft} enableBorders={true} />
              <BackgroundScanline className={classes.marginRight} enableBorders={true} />
            </div>
            <div
              className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}
              style={wrapperStyle}
            >
              {cards.map((card, index) => {
                // Skip null or undefined cards
                if (!card) {
                  return null
                }

                const { description, enableLink, link, title } = card
                return (
                  <div className={'cols-4 cols-s-8'} key={index}>
                    <SquareCard
                      className={classes.card}
                      description={description}
                      enableLink={enableLink}
                      leader={(index + 1).toString().padStart(2, '0')}
                      link={link}
                      revealDescription={revealDescription}
                      title={title}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
