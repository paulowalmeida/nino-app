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
import { StoreAvailabilityBanner } from '@pages/Storefront/components/StoreHeader/StoreAvailabilityBanner/StoreAvailabilityBanner'
import { StoreInfo } from '@pages/Storefront/components/StoreHeader/StoreInfo/StoreInfo'
import { StoreTopBar } from '@pages/Storefront/components/StoreHeader/StoreTopBar/StoreTopBar'
import { TabBar } from '@shared/components/TabBar/TabBar/TabBar'
import { CategoryBar } from '@pages/Storefront/components/StoreMenu/CategoryBar/CategoryBar'
import { MenuSearchField } from '@pages/Storefront/components/StoreMenu/MenuSearchField/MenuSearchField'
import { MenuRowsSkeleton } from '@pages/Storefront/skeletons/MenuRowsSkeleton/MenuRowsSkeleton'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { StoreBanner } from '@pages/Storefront/components/StoreHeader/StoreBanner/StoreBanner'
import { useDockedHeader } from '@pages/Storefront/hooks/useDockedHeader/useDockedHeader'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { useStoreHome } from '@hooks/useStoreHome/useStoreHome'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'

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
  const [searchField, setSearchField] = useState<HTMLInputElement | null>(null)
  const isHeaderDocked = useDockedHeader(searchField, DOCKED_HEADER_OFFSET_PX)
  const { search, visibleSections, isSearching } = home
  const blocks = useStoreHome()

  useLayoutEffect(() => {
    reset()
  }, [reset, slug])

  const base = pathSlug ? `/${pathSlug}` : ''

  return (
    <Box
      className={styles.page}
      style={
        home.store?.primaryColor
          ? ({ '--store-tint': home.store.primaryColor } as React.CSSProperties)
          : undefined
      }
    >
      <StoreTopBar slug={pathSlug ?? ''} isDocked={isHeaderDocked} />

      {blocks.showBanner && <StoreBanner />}

      <Box className={styles.shell}>
        <StoreIdentity />

        <StoreAvailabilityBanner />

        <ActiveOrderBanner slug={slug ?? ''} />

        {blocks.showSearch && home.sections.length > 0 && (
          <MenuSearchField ref={setSearchField} />
        )}
      </Box>

      {blocks.showCategoryBar && home.sections.length > 0 && !isSearching && (
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

          {!home.isMenuPending && home.isMenuError && (
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

          {!home.isMenuPending &&
            !home.isMenuError &&
            home.sections.length === 0 && (
              <EmptyState className={styles.empty}>
                Esta loja ainda não publicou itens no cardápio.
              </EmptyState>
            )}

          {!home.isMenuPending &&
            !home.isMenuError &&
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
      <TabBar
        base={base}
        cartCount={home.cartCount}
        onOpenCart={() => home.setCartOpen(true)}
      />

      {blocks.showStoreInfo && <StoreInfo />}

    </Box>
  )
}
