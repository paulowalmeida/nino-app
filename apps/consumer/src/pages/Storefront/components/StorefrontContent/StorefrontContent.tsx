import { useLayoutEffect, useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { ActiveOrderBanner } from '@pages/Storefront/components/ActiveOrderBanner/ActiveOrderBanner'
import { StoreCart } from '@pages/Storefront/components/StoreCart/StoreCart'
import { CategoryNav } from '@pages/Storefront/components/StoreMenu/CategoryNav/CategoryNav'
import { MenuSection } from '@pages/Storefront/components/StoreMenu/MenuSection/MenuSection'
import { StoreIdentity } from '@pages/Storefront/components/StoreHeader/StoreIdentity/StoreIdentity'
import { StorefrontNotificationsDrawer } from '@pages/Storefront/components/StorefrontNotificationsDrawer/StorefrontNotificationsDrawer'
import { StorefrontCouponsDrawer } from '@pages/Storefront/components/StorefrontCouponsDrawer/StorefrontCouponsDrawer'
import { StoreAvailabilityBanner } from '@pages/Storefront/components/StoreHeader/StoreAvailabilityBanner/StoreAvailabilityBanner'
import { StoreInfo } from '@pages/Storefront/components/StoreHeader/StoreInfo/StoreInfo'
import { StoreTopBar } from '@pages/Storefront/components/StoreHeader/StoreTopBar/StoreTopBar'
import { CategoryBar } from '@pages/Storefront/components/StoreMenu/CategoryBar/CategoryBar'
import { MenuSearchModal } from '@pages/Storefront/components/StoreMenu/MenuSearchModal/MenuSearchModal'
import { MenuSearchField } from '@pages/Storefront/components/StoreMenu/MenuSearchField/MenuSearchField'
import { MenuRowsSkeleton } from '@pages/Storefront/skeletons/MenuRowsSkeleton/MenuRowsSkeleton'
import { StoreHeaderSkeleton } from '@pages/Storefront/skeletons/StoreHeaderSkeleton/StoreHeaderSkeleton'
import { MenuEmptyIllustration } from '@shared/components/Illustrations/MenuEmptyIllustration/MenuEmptyIllustration'
import { FooterNav } from '@shared/components/FooterNav/FooterNav'
import { PromotionBanner } from '@pages/Storefront/components/StoreHeader/PromotionBanner/PromotionBanner'
import { StoreBanner } from '@pages/Storefront/components/StoreHeader/StoreBanner/StoreBanner'
import { PromotionSection } from '@pages/Storefront/components/PromotionSection/PromotionSection'
import { useDockedHeader } from '@pages/Storefront/hooks/useDockedHeader/useDockedHeader'
import { useImagePreload } from '@pages/Storefront/hooks/useImagePreload/useImagePreload'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { useStoreHome } from '@hooks/useStoreHome/useStoreHome'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'
import { primaryImage } from '@utils/menu-image'
import {
  storeThemeBannerUrl,
  storeThemeLogoUrl,
  storeThemePrimaryColor,
} from '@utils/store-theme/store-theme'

import styles from './StorefrontContent.module.css'
import motion from '@styles/motion.module.css'

const DOCKED_HEADER_OFFSET_PX = 56

type StorefrontContentProps = {
  pathSlug: string | undefined
}

export const StorefrontContent = ({ pathSlug }: StorefrontContentProps) => {
  const slug = resolveSlug(pathSlug)
  const home = useStorefrontFacade(slug ?? undefined)
  const { reset } = home
  const [dockSentinel, setDockSentinel] = useState<HTMLElement | null>(null)
  const isHeaderDocked = useDockedHeader(dockSentinel, DOCKED_HEADER_OFFSET_PX)
  const [categorySentinel, setCategorySentinel] = useState<HTMLElement | null>(
    null
  )
  const isCategoryDocked = useDockedHeader(
    categorySentinel,
    DOCKED_HEADER_OFFSET_PX
  )
  const { visibleSections } = home
  const blocks = useStoreHome()
  const tint = storeThemePrimaryColor(home.store)
  const bannerUrl = blocks.showBanner ? storeThemeBannerUrl(home.store) : null
  const logoUrl = storeThemeLogoUrl(home.store)
  const isBannerPending = useImagePreload(bannerUrl)
  const isLogoPending = useImagePreload(logoUrl)
  const menuImageUrls = home.sections.flatMap((section) =>
    section.items.map(primaryImage)
  )
  const isMenuImagePending = useImagePreload(
    home.isMenuError ? [] : menuImageUrls
  )
  const isMenuContentPending = home.isMenuPending || isMenuImagePending
  const isHeaderReady =
    !home.isHeaderPending && !isBannerPending && !isLogoPending

  useLayoutEffect(() => {
    reset()
  }, [reset, slug])

  const base = pathSlug ? `/${pathSlug}` : ''
  const header = !isHeaderReady ? (
    <StoreHeaderSkeleton
      showBanner={blocks.showBanner}
      showSearch={blocks.showSearch}
    />
  ) : (
    <>
      <StoreTopBar slug={pathSlug ?? ''} isDocked={isHeaderDocked} />

      {blocks.showBanner && <StoreBanner />}

      <Box className={styles.storefrontContentShell}>
        <StoreIdentity />

        {/* WHY: a barra do topo assume quando a identidade da loja passa por baixo dela. */}
        <Box ref={setDockSentinel} aria-hidden="true" />

        <PromotionBanner />

        <StoreAvailabilityBanner />

        {blocks.showSearch && home.sections.length > 0 && <MenuSearchField />}
      </Box>
    </>
  )

  return (
    <Box
      className={styles.storefrontContentPage}
      style={
        tint ? ({ '--store-tint': tint } as React.CSSProperties) : undefined
      }
    >
      {header}

      {!isMenuContentPending &&
        blocks.showCategoryBar &&
        home.visibleSections.length > 0 && (
          <>
            <Box ref={setCategorySentinel} aria-hidden="true" />
            <CategoryBar
              className={motion.deal}
              style={riseDelay(140)}
            >
              <CategoryNav compact={isCategoryDocked} />
            </CategoryBar>
          </>
        )}

      <Box
        as="main"
        className={`${styles.storefrontContentShell} ${styles.storefrontContentMain}`}
      >
        <Box className={styles.storefrontContentMenu}>
          {isMenuContentPending && <MenuRowsSkeleton />}

          {!isMenuContentPending && home.isMenuError && (
            <>
              <Alert
                variant="error"
                title="Não foi possível carregar o cardápio"
              >
                Tente novamente em instantes.
              </Alert>
              <Button variant="outline" onClick={() => void home.retryMenu()}>
                Tentar novamente
              </Button>
            </>
          )}

          {!isMenuContentPending &&
            !home.isMenuError &&
            home.sections.length === 0 && (
              <EmptyState
                size="md"
                className={styles.storefrontContentEmpty}
                illustration={<MenuEmptyIllustration />}
                title="Cardápio em preparo"
              >
                Esta loja ainda não publicou itens no cardápio.
              </EmptyState>
            )}

          {!isMenuContentPending && !home.isMenuError && <PromotionSection />}

          {!isMenuContentPending &&
            visibleSections.map((section, index) => (
              <MenuSection
                key={section.id}
                section={section}
                animateEntrance={index === 0}
              />
            ))}
        </Box>
      </Box>

      <ActiveOrderBanner slug={slug ?? ''} />

      <StoreCart />
      {home.sections.length > 0 && <MenuSearchModal />}

      <FooterNav
        base={base}
        cartCount={home.cartCount}
        onOpenCart={() => home.setCartOpen(true)}
        onOpenSearch={
          blocks.showSearch && home.sections.length > 0
            ? () => home.setSearchOpen(true)
            : undefined
        }
        onOpenCoupons={
          home.promotionPanelOffers.length > 0
            ? () => home.setCouponsOpen(true)
            : undefined
        }
      />

      {blocks.showStoreInfo && <StoreInfo />}
      <StorefrontCouponsDrawer />
      <StorefrontNotificationsDrawer />
    </Box>
  )
}
