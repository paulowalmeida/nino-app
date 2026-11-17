import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { PromotionArt } from '@pages/Storefront/components/StoreHeader/PromotionArt/PromotionArt'
import { promotionPhotos } from '@pages/Storefront/utils/promotion-photos/promotion-photos'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { resolveApiAssetUrl } from '@utils/api-asset-url/api-asset-url'

import styles from './PromotionBanner.module.css'

export const PromotionBanner = () => {
  const {
    bannerOffers: imageOffers,
    freeDelivery,
    discountOffer,
    giftOffer,
    sections,
    setFocusedPromotionId,
  } = useStorefrontFacade()
  const { slug } = useParams()
  const navigate = useNavigate()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const imageIds = new Set(imageOffers.map(({ id }) => id))
  const artOffers = [freeDelivery, discountOffer, giftOffer].filter(
    (offer): offer is PublicPromotion => !!offer && !imageIds.has(offer.id)
  )
  const bannerOffers = [...imageOffers, ...artOffers]

  const hasMany = bannerOffers.length > 1

  const slideStep = useCallback(() => {
    const [first, second] = Array.from(trackRef.current?.children ?? [])
    if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement))
      return 0
    return second.offsetLeft - first.offsetLeft
  }, [])

  const goTo = useCallback(
    (index: number) => {
      const count = bannerOffers.length
      if (!count) return
      const target = ((index % count) + count) % count
      trackRef.current?.scrollTo({
        left: target * slideStep(),
        behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)')
          .matches
          ? 'auto'
          : 'smooth',
      })
    },
    [bannerOffers.length, slideStep]
  )

  useEffect(() => {
    if (!trackRef.current || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    })
    observer.observe(trackRef.current)
    return () => observer.disconnect()
  }, [hasMany])

  useEffect(() => {
    if (
      !hasMany ||
      isHovered ||
      isFocused ||
      !isVisible ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    )
      return

    const timer = window.setInterval(() => {
      if (!document.hidden) goTo(active + 1)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [active, goTo, hasMany, isFocused, isHovered, isVisible])

  if (bannerOffers.length === 0) return null

  const handleScroll = () => {
    const step = slideStep()
    if (!step || !trackRef.current) return
    setActive(Math.round(trackRef.current.scrollLeft / step))
  }

  return (
    <Box
      className={styles.promotionBanner}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false)
        }
      }}
    >
      <Box
        ref={trackRef}
        className={styles.track}
        onScroll={handleScroll}
        role="group"
        aria-roledescription="carrossel"
        aria-label="Promoções da loja"
      >
        {bannerOffers.map((promotion) => (
          <Box
            key={promotion.id}
            className={`${styles.slide} ${hasMany ? '' : styles.single} ${
              imageIds.has(promotion.id) ? '' : styles.artSlide
            }`}
          >
            {imageIds.has(promotion.id) ? (
              <Image
                src={resolveApiAssetUrl(promotion.imageUrl)}
                alt={promotion.name}
                className={styles.image}
                wrapperClassName={styles.imageWrap}
                placeholder={
                  <Box className={styles.placeholder} aria-hidden="true" />
                }
              />
            ) : (
              <PromotionArt
                promotion={promotion}
                photos={promotionPhotos(promotion, sections)}
                onSelect={({ id }) => setFocusedPromotionId(id)}
              />
            )}
            {imageIds.has(promotion.id) && (
              <button
                type="button"
                className={styles.action}
                aria-label={`Abrir ${promotion.name}`}
                onClick={() =>
                  promotion.type === 'PACKAGE'
                    ? void navigate(
                        `${slug ? `/${slug}` : ''}/promocao/${promotion.id}`
                      )
                    : setFocusedPromotionId(promotion.id)
                }
              />
            )}
          </Box>
        ))}
      </Box>

      {hasMany && (
        <>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`${styles.arrow} ${styles.previous}`}
            aria-label="Promoção anterior"
            onClick={() => goTo(active - 1)}
          >
            <Icon name="chevron-left" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`${styles.arrow} ${styles.next}`}
            aria-label="Próxima promoção"
            onClick={() => goTo(active + 1)}
          >
            <Icon name="chevron-right" />
          </Button>
          <Box direction="row" className={styles.dots}>
            {bannerOffers.map((offer, index) => (
              <button
                key={offer.id}
                type="button"
                className={`${styles.dot} ${
                  index === active ? styles.activeDot : ''
                }`}
                aria-label={`Ir para promoção ${index + 1}`}
                aria-current={index === active}
                onClick={() => goTo(index)}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}
