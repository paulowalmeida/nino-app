import { useRef } from 'react'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Box } from '@nino/ds/components/Box'
import { ActiveOrderBanner } from '@pages/Home/components/HomeContent/ActiveOrderBanner/ActiveOrderBanner'
import { CartDock } from '@pages/Home/components/HomeContent/CartDock/CartDock'
import { CartDrawer } from '@pages/Home/components/HomeContent/CartDrawer/CartDrawer'
import { CategoryNav } from '@pages/Home/components/HomeContent/CategoryNav/CategoryNav'
import { MenuSection } from '@pages/Home/components/HomeContent/MenuSection/MenuSection'
import { ProductDetail } from '@pages/Home/components/HomeContent/ProductDetail/ProductDetail'
import { StoreIdentity } from '@pages/Home/components/HomeContent/StoreIdentity/StoreIdentity'
import { StoreInfo } from '@pages/Home/components/HomeContent/StoreInfo/StoreInfo'
import { StoreTopBar } from '@pages/Home/components/HomeContent/StoreTopBar/StoreTopBar'
import { TabBar } from '@shared/components/TabBar/TabBar/TabBar'
import { CategoryBar } from '@pages/Home/components/HomeContent/CategoryBar/CategoryBar'
import { MenuSearchField } from '@pages/Home/components/HomeContent/MenuSearchField/MenuSearchField'
import { MenuRowsSkeleton } from '@pages/Home/skeletons/MenuRowsSkeleton/MenuRowsSkeleton'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { StoreBanner } from '@pages/Home/components/HomeContent/StoreBanner/StoreBanner'
import { useMenuSections } from '@pages/Home/hooks/useMenuSections/useMenuSections'
import { useScrollProgress } from '@hooks/useScrollProgress/useScrollProgress'
import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'

import styles from './HomeContent.module.css'
import motion from '@styles/motion.module.css'

const HEADER_TRANSITION_PX = 140

type HomeContentProps = {
  pathSlug: string | undefined
}

export const HomeContent = ({ pathSlug }: HomeContentProps) => {
  const slug = resolveSlug(pathSlug)
  const home = useHomeFacade(slug ?? undefined)
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

      <CartDock />

      <PoweredBy />
      <TabBar base={base} />

      <StoreInfo />

      <CartDrawer />

      <ProductDetail />
    </Box>
  )
}
