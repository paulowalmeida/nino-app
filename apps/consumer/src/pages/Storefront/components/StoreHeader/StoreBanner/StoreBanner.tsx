import { Box } from '@nino/ds/components/Box'
import { Image } from '@nino/ds/components/Image'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { storeInitials } from '@utils/store-info'
import {
  storeThemeBannerCrops,
  storeThemeBannerVariants,
  storeThemeBannerUrl,
  storeThemeLogoUrl,
} from '@utils/store-theme/store-theme'
import type {
  BannerCrop,
  BannerCrops,
  BannerVariants,
} from '@custom_types/store/store-theme'

import styles from './StoreBanner.module.css'

const CROP_IDS = [
  'phone320',
  'phone425',
  'tablet768',
  'desktop1024',
  'desktop1920',
] as const

const hasCompleteCrops = (crops?: BannerCrops) =>
  CROP_IDS.every((id) => Boolean(crops?.[id]))

const hasVariants = (variants?: BannerVariants) =>
  CROP_IDS.some((id) => Boolean(variants?.[id]))

const variantClasses = (variants?: BannerVariants) =>
  [
    variants?.phone320 && styles.variantPhone320,
    variants?.phone425 && styles.variantPhone425,
    variants?.tablet768 && styles.variantTablet768,
    variants?.desktop1024 && styles.variantDesktop1024,
    variants?.desktop1920 && styles.variantDesktop1920,
  ]
    .filter(Boolean)
    .join(' ')

const cropVariables = (crops?: BannerCrops): CSSProperties => {
  const variables: Record<string, string> = {}
  CROP_IDS.forEach((id) => {
    const crop: BannerCrop | undefined = crops?.[id]
    if (!crop) return
    variables[`--banner-${id}-x`] = String(crop.x)
    variables[`--banner-${id}-y`] = String(crop.y)
    variables[`--banner-${id}-width`] = String(crop.width)
    variables[`--banner-${id}-height`] = String(crop.height)
  })
  return variables as CSSProperties
}

export const StoreBanner = () => {
  const { store } = useStorefrontFacade()
  const bannerUrl = storeThemeBannerUrl(store)
  const bannerCrops = storeThemeBannerCrops(store)
  const bannerVariants = storeThemeBannerVariants(store)
  const hasResponsiveCrops = hasCompleteCrops(bannerCrops)
  const hasBannerVariants = hasVariants(bannerVariants)
  const logoUrl = storeThemeLogoUrl(store)

  if (!store) return null

  return (
    <Box
      className={`${styles.storeBanner} ${bannerUrl ? styles.customBanner : ''} ${variantClasses(bannerVariants)}`}
    >
      {bannerUrl && hasBannerVariants ? (
        <picture className={styles.imageWrap}>
          {bannerVariants?.desktop1920 && (
            <source
              media="(min-width: 1280px)"
              srcSet={bannerVariants.desktop1920}
            />
          )}
          {bannerVariants?.desktop1024 && (
            <source
              media="(min-width: 1024px) and (max-width: 1279px)"
              srcSet={bannerVariants.desktop1024}
            />
          )}
          {bannerVariants?.tablet768 && (
            <source
              media="(min-width: 640px) and (max-width: 1023px)"
              srcSet={bannerVariants.tablet768}
            />
          )}
          {bannerVariants?.phone425 && (
            <source
              media="(min-width: 375px) and (max-width: 639px)"
              srcSet={bannerVariants.phone425}
            />
          )}
          {bannerVariants?.phone320 && (
            <source
              media="(max-width: 374px)"
              srcSet={bannerVariants.phone320}
            />
          )}
          <img
            src={bannerUrl}
            alt=""
            className={`${styles.image} ${
              hasResponsiveCrops ? styles.responsiveImage : ''
            }`}
            style={cropVariables(bannerCrops)}
          />
        </picture>
      ) : bannerUrl ? (
        <Image
          src={bannerUrl}
          alt=""
          className={`${styles.image} ${
            hasResponsiveCrops ? styles.responsiveImage : ''
          }`}
          wrapperClassName={styles.imageWrap}
          style={cropVariables(bannerCrops)}
          placeholder={
            <Box className={styles.imagePlaceholder} aria-hidden="true" />
          }
        />
      ) : logoUrl ? (
        <img src={logoUrl} alt="" className={styles.mark} />
      ) : (
        <Text as="span" className={styles.monogram} aria-hidden="true">
          {storeInitials(store)}
        </Text>
      )}
    </Box>
  )
}
import type { CSSProperties } from 'react'
