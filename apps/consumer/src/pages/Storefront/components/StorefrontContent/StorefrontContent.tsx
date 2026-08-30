import { useRef } from 'react'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Box } from '@nino/ds/components/Box'
import { ActiveOrderBanner } from '@pages/Storefront/components/ActiveOrderBanner/ActiveOrderBanner'
import { StoreCart } from '@pages/Storefront/components/StoreCart/StoreCart'
import { CategoryNav } from '@pages/Storefront/components/StoreMenu/CategoryNav/CategoryNav'
import { MenuSection } from '@pages/Storefront/components/StoreMenu/MenuSection/MenuSection'
import { ProductDetail } from '@pages/Storefront/components/StoreMenu/ProductDetail/ProductDetail'
import { StoreIdentity } from '@pages/Storefront/components/StoreHeader/StoreIdentity/StoreIdentity'
import { StoreAvailabilityBanner } from '@pages/Storefront/components/StoreHeader/StoreAvailabilityBanner/StoreAvailabilityBanner'
import { StoreInfo } from '@pages/Storefront/components/StoreHeader/StoreInfo/StoreInfo'
import { StoreTopBar } from '@pages/Storefront/components/StoreHeader/StoreTopBar/StoreTopBar'
import { TabBar } from '@shared/components/TabBar/TabBar/TabBar'
import { CategoryBar } from '@pages/Storefront/components/StoreMenu/CategoryBar/CategoryBar'
import { MenuSearchField } from '@pages/Storefront/components/StoreMenu/MenuSearchField/MenuSearchField'
import { MenuRowsSkeleton } from '@pages/Storefront/skeletons/MenuRowsSkeleton/MenuRowsSkeleton'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { StoreBanner } from '@pages/Storefront/components/StoreHeader/StoreBanner/StoreBanner'
import { useMenuSections } from '@pages/Storefront/hooks/useMenuSections/useMenuSections'
import { useScrollProgress } from '@hooks/useScrollProgress/useScrollProgress'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'

import styles from './StorefrontContent.module.css'
import motion from '@styles/motion.module.css'

const HEADER_TRANSITION_PX = 140

type StorefrontContentProps = {
  pathSlug: string | undefined
}

export const StorefrontContent = ({ pathSlug }: StorefrontContentProps) => {
  const slug = resolveSlug(pathSlug)
  const home = useStorefrontFacade(slug ?? undefined)
  const searchRef = useRef<HTMLInputElement>(null)
  const progress = useScrollProgress(HEADER_TRANSITION_PX)
  const { search } = home

  const { visibleSections, isSearching } = useMenuSections(
    home.sections,
    search
  )

  const base = pathSlug ? `/${pathSlug}` : ''

  return (
    <Box
      className={
        home.cartCount > 0
          ? `${styles.page} ${styles.pageWithCart}`
          : styles.page
      }
      style={
        {
          '--p': progress,
          ...(home.store?.primaryColor
            ? { '--store-tint': home.store.primaryColor }
            : {}),
        } as React.CSSProperties
      }
    >
      <StoreTopBar slug={pathSlug ?? ''} progress={progress} />

      <StoreBanner />

      <Box className={styles.shell}>
        <StoreIdentity />

        <StoreAvailabilityBanner />

        <ActiveOrderBanner slug={slug ?? ''} />

        {home.sections.length > 0 && <MenuSearchField ref={searchRef} />}
      </Box>

      {home.sections.length > 0 && !isSearching && (
        <CategoryBar className={motion.settle} style={riseDelay(140)}>
          <CategoryNav />
        </CategoryBar>
      )}

      <Box as="main" className={`${styles.shell} ${styles.main}`}>
        <Box
          className={`${motion.settle} ${styles.menu}`}
          style={riseDelay(200)}
        >
          {home.isMenuPending && <MenuRowsSkeleton />}

          {!home.isMenuPending && home.sections.length === 0 && (
            <EmptyState className={styles.empty}>
              Esta loja ainda não publicou itens no cardápio.
            </EmptyState>
          )}

          {!home.isMenuPending &&
            isSearching &&
            visibleSections.length === 0 && (
              <EmptyState className={styles.empty}>
                Nada encontrado para “{search}”.
              </EmptyState>
            )}

          {visibleSections.map((section) => (
            <MenuSection key={section.id} section={section} />
          ))}
        </Box>
      </Box>

      <StoreCart />

      <PoweredBy />
      <TabBar base={base} />

      <StoreInfo />

      <ProductDetail />
    </Box>
  )
}
