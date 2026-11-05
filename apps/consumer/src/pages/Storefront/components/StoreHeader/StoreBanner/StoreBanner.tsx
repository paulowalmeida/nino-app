import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Image } from '@nino/ds/components/Image'
import { Text } from '@nino/ds/components/Text'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { storeInitials } from '@utils/store-info'
import {
  storeThemeBannerUrl,
  storeThemeLogoUrl,
} from '@utils/store-theme/store-theme'
import { resolveApiAssetUrl } from '@utils/api-asset-url/api-asset-url'

import styles from './StoreBanner.module.css'

type StoreBannerProps = { includeStoreBanner?: boolean }

export const StoreBanner = ({
  includeStoreBanner = true,
}: StoreBannerProps) => {
  const { store, bannerOffers } = useStorefrontFacade()
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const bannerRef = useRef<HTMLDivElement>(null)
  const logoUrl = storeThemeLogoUrl(store)
  const bannerUrl = storeThemeBannerUrl(store)
  const hasCustomBanner = Boolean(bannerUrl)
  const slides = useMemo(
    () => [
      ...(includeStoreBanner
        ? [{ id: 'store', imageUrl: bannerUrl, promotion: null }]
        : []),
      ...bannerOffers.map((promotion) => ({
        id: promotion.id,
        imageUrl: resolveApiAssetUrl(promotion.imageUrl),
        promotion,
      })),
    ],
    [bannerOffers, bannerUrl, includeStoreBanner]
  )
  const safeActiveIndex = slides.length
    ? Math.min(activeIndex, slides.length - 1)
    : 0
  const active = slides[safeActiveIndex] ?? slides[0]

  useEffect(() => {
    const banner = bannerRef.current
    if (
      active?.id !== 'store' ||
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
  }, [active?.id, hasCustomBanner])

  if (!active) return null

  const openPromotion = () => {
    if (active.promotion?.type !== 'PACKAGE') return
    void navigate(`${slug ? `/${slug}` : ''}/promocao/${active.promotion.id}`)
  }

  return (
    <Box
      ref={bannerRef}
      className={`${styles.storeBanner} ${
        active.imageUrl ? styles.customBanner : ''
      }`}
    >
      {active.imageUrl && (
        <Image
          src={active.imageUrl}
          alt={active.promotion?.name ?? ''}
          className={styles.customImage}
          wrapperClassName={styles.customImageWrap}
          placeholder={
            <Box className={styles.imagePlaceholder} aria-hidden="true" />
          }
        />
      )}
      {!active.imageUrl && logoUrl && (
        <img src={logoUrl} alt="" className={styles.mark} />
      )}
      {!active.imageUrl && !logoUrl && store && (
        <Text as="span" className={styles.monogram} aria-hidden="true">
          {storeInitials(store)}
        </Text>
      )}
      {active.promotion?.type === 'PACKAGE' && (
        <button
          type="button"
          className={styles.slideAction}
          aria-label={`Abrir ${active.promotion.name}`}
          onClick={openPromotion}
        />
      )}
      {slides.length > 1 && (
        <>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`${styles.carouselButton} ${styles.previous}`}
            aria-label="Banner anterior"
            onClick={() =>
              setActiveIndex((index) => {
                const current = Math.min(index, slides.length - 1)
                return current === 0 ? slides.length - 1 : current - 1
              })
            }
          >
            <Icon name="chevron-left" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`${styles.carouselButton} ${styles.next}`}
            aria-label="Próximo banner"
            onClick={() =>
              setActiveIndex((index) => {
                const current = Math.min(index, slides.length - 1)
                return (current + 1) % slides.length
              })
            }
          >
            <Icon name="chevron-right" />
          </Button>
          <Box className={styles.dots} aria-label="Banners da loja">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`${styles.dot} ${
                  index === activeIndex ? styles.activeDot : ''
                }`}
                aria-label={`Mostrar banner ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}
