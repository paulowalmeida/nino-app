import { useEffect, useRef } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Image } from '@nino/ds/components/Image'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { storeInitials } from '@utils/store-info'
import {
  storeThemeBannerUrl,
  storeThemeLogoUrl,
} from '@utils/store-theme/store-theme'

import styles from './StoreBanner.module.css'

export const StoreBanner = () => {
  const { store } = useStorefrontFacade()
  const bannerRef = useRef<HTMLDivElement>(null)
  const logoUrl = storeThemeLogoUrl(store)
  const bannerUrl = storeThemeBannerUrl(store)
  const hasCustomBanner = Boolean(bannerUrl)

  useEffect(() => {
    const banner = bannerRef.current
    if (
      hasCustomBanner ||
      !banner ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return

    let frame: number | null = null
    const updateParallax = () => {
      frame = null
      const distance = Math.min(
        80,
        Math.max(-80, -banner.getBoundingClientRect().top * 0.4)
      )
      banner.style.setProperty('--banner-parallax', `${distance}px`)
    }
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [hasCustomBanner])

  return (
    <Box
      ref={bannerRef}
      className={`${styles.storeBanner} ${
        hasCustomBanner ? styles.customBanner : ''
      }`}
    >
      {bannerUrl && (
        <Image
          src={bannerUrl}
          alt=""
          className={styles.customImage}
          wrapperClassName={styles.customImageWrap}
          placeholder={
            <Box className={styles.imagePlaceholder} aria-hidden="true" />
          }
        />
      )}
      {!hasCustomBanner && logoUrl && (
        <img src={logoUrl} alt="" className={styles.mark} />
      )}
      {!hasCustomBanner && !logoUrl && store && (
        <Text as="span" className={styles.monogram} aria-hidden="true">
          {storeInitials(store)}
        </Text>
      )}
    </Box>
  )
}
