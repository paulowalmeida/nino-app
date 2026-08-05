import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { ActiveOrderBanner } from '@compositions/ActiveOrderBanner/ActiveOrderBanner'
import { CartDock } from '@compositions/CartDock/CartDock'
import { CartDrawer } from '@compositions/CartDrawer/CartDrawer'
import { CategoryNav } from '@compositions/CategoryNav/CategoryNav'
import { MenuSection } from '@compositions/MenuSection/MenuSection'
import { StoreIdentity } from '@compositions/StoreIdentity/StoreIdentity'
import { ProductDetail } from '@compositions/ProductDetail/ProductDetail'
import { StoreInfo } from '@compositions/StoreInfo/StoreInfo'
import { StoreTopBar } from '@compositions/StoreTopBar/StoreTopBar'
import { TabBar } from '@compositions/TabBar/TabBar'
import { CategoryBar } from '@elements/CategoryBar/CategoryBar'
import { MenuSearchField } from '@elements/MenuSearchField/MenuSearchField'
import { PoweredBy } from '@elements/PoweredBy/PoweredBy'
import { StoreBanner } from '@elements/StoreBanner/StoreBanner'
import { StoreLookupEmptyState } from '@elements/StoreLookupEmptyState/StoreLookupEmptyState'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { useCartSummary } from '@hooks/useCartSummary'
import { useMenu } from '@hooks/useMenu'
import { useMenuSections } from '@hooks/useMenuSections'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { useScrollProgress } from '@hooks/useScrollProgress'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'
import { MenuRowsSkeleton } from '@skeletons/MenuRowsSkeleton/MenuRowsSkeleton'
import { StorefrontSkeleton } from '@skeletons/StorefrontSkeleton/StorefrontSkeleton'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'
import { isOpen } from '@utils/store-info'

import styles from './Storefront.module.css'
import motion from '@styles/motion.module.css'

/**
 * Distância em que a transição do topo acontece: o suficiente para o azulejo
 * da logo sair de vista, e curta o bastante para a barra já estar montada
 * quando o primeiro item do cardápio chega.
 */
const HEADER_TRANSITION_PX = 140

export const Home = () => {
  // Hooks
  const navigate = useNavigate()
  const { slug: pathSlug } = useParams()
  const slug = resolveSlug(pathSlug)
  const {
    store,
    isPending: loadingStore,
    isError,
  } = useStore(slug ?? undefined)
  const { sections, isPending: loadingMenu } = useMenu(store?.id)
  const { hours, isPending: loadingHours } = useOpeningHours(store?.id)
  const { settings } = usePublicSettings(store?.id)

  const searchRef = useRef<HTMLInputElement>(null)
  const progress = useScrollProgress(HEADER_TRANSITION_PX)
  const {
    lines: cart,
    cartLines,
    count: cartCount,
    total: cartTotal,
    add: addToCart,
    increment: incrementCartLine,
    decrement: decrementCartLine,
    clear: clearCart,
  } = useCartSummary()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [search, setSearch] = useState('')

  const { visibleSections, activeId, goToSection, sectionDomId, isSearching } =
    useMenuSections(sections, search)

  const handleConfirmDetail = (item: MenuItem, quantity: number) => {
    addToCart(item, quantity)
    setSelectedItem(null)
  }

  if (!slug) {
    return (
      <StoreLookupEmptyState
        mascotSrc="/mascot-consumer.svg"
        title="Qual loja você procura?"
      >
        Abra pelo link da loja — cada uma tem o seu endereço.
      </StoreLookupEmptyState>
    )
  }

  if (loadingStore) return <StorefrontSkeleton />

  if (isError || !store) {
    return (
      <StoreLookupEmptyState
        mascotSrc="/mascot-consumer-sad.svg"
        title="Loja não encontrada"
      >
        Confira o link — o endereço pode ter mudado ou a loja saiu do ar.
      </StoreLookupEmptyState>
    )
  }

  const storeOpen = loadingHours || isOpen(store, hours)
  const base = pathSlug ? `/${pathSlug}` : ''

  return (
    <div
      className={
        cartCount > 0 ? `${styles.page} ${styles.pageWithCart}` : styles.page
      }
      style={
        {
          '--p': progress,
          ...(store.primaryColor ? { '--store-tint': store.primaryColor } : {}),
        } as React.CSSProperties
      }
    >
      <StoreTopBar
        store={store}
        slug={pathSlug ?? ''}
        cartCount={cartCount}
        onCart={() => setIsCartOpen(true)}
        progress={progress}
        searchable={sections.length > 0}
        search={search}
        onSearchChange={setSearch}
      />

      <StoreBanner logoUrl={store.logoUrl} className={motion.unroll} />

      <div className={styles.shell}>
        <StoreIdentity
          store={store}
          isStoreOpen={storeOpen}
          estimatedMinutes={settings?.estimatedMinutes}
          onShowInfo={() => setIsInfoOpen(true)}
        />

        <ActiveOrderBanner slug={slug} />

        {sections.length > 0 && (
          <MenuSearchField ref={searchRef} value={search} onChange={setSearch} />
        )}
      </div>

      {sections.length > 0 && !isSearching && (
        <CategoryBar className={motion.settle} style={riseDelay(140)}>
          <CategoryNav
            sections={sections}
            activeId={activeId}
            onSelect={goToSection}
          />
        </CategoryBar>
      )}

      <main className={`${styles.shell} ${styles.main}`}>
        <div
          className={`${motion.settle} ${styles.menu}`}
          style={riseDelay(200)}
        >
          {loadingMenu && <MenuRowsSkeleton />}

          {!loadingMenu && sections.length === 0 && (
            <EmptyState className={styles.empty}>
              Esta loja ainda não publicou itens no cardápio.
            </EmptyState>
          )}

          {!loadingMenu && isSearching && visibleSections.length === 0 && (
            <EmptyState className={styles.empty}>
              Nada encontrado para “{search}”.
            </EmptyState>
          )}

          {visibleSections.map((section) => (
            <MenuSection
              key={section.id}
              section={section}
              domId={sectionDomId(section.id)}
              cart={cart}
              storeOpen={storeOpen}
              onAdd={addToCart}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      </main>

      <CartDock
        count={cartCount}
        total={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <PoweredBy />

      <TabBar base={base} />

      <StoreInfo
        store={store}
        hours={hours}
        estimatedMinutes={settings?.estimatedMinutes}
        open={isInfoOpen}
        onOpenChange={setIsInfoOpen}
      />

      <CartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        lines={cartLines}
        total={cartTotal}
        estimatedMinutes={settings?.estimatedMinutes}
        onIncrement={incrementCartLine}
        onDecrement={decrementCartLine}
        onClear={clearCart}
        onCheckout={() => {
          setIsCartOpen(false)
          void navigate(pathSlug ? `/${pathSlug}/checkout` : '/checkout')
        }}
      />

      <ProductDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={handleConfirmDetail}
      />
    </div>
  )
}
