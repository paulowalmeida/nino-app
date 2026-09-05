import styles from './StoreBanner.module.css'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { storeInitials } from '@utils/store-info'

export const StoreBanner = () => {
  const { store } = useStorefrontFacade()
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const banner = bannerRef.current
    if (!banner || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return

    let frame: number | null = null
    const updateParallax = () => {
      frame = null
      const distance = Math.min(
        80,
        Math.max(-80, -banner.getBoundingClientRect().top * 0.4),
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
  }, [])

  return (
    <Box ref={bannerRef} className={styles.banner}>
      {store?.logoUrl && (
        <img src={store.logoUrl} alt="" className={styles.mark} />
      )}
      {!store?.logoUrl && store && (
        <Text as="span" className={styles.monogram} aria-hidden="true">
          {storeInitials(store)}
        </Text>
      )}
    </Box>
  )
}
import { useEffect, useRef } from 'react'
