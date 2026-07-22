import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Input } from '@nino/ds'

import searchIcon from '@assets/icons/search.svg?raw'
import { Icon } from '@components/Icon/Icon'
import { ActiveOrderBanner } from '@compositions/ActiveOrderBanner/ActiveOrderBanner'
import { CartDrawer } from '@compositions/CartDrawer/CartDrawer'
import { CategoryNav } from '@compositions/CategoryNav/CategoryNav'
import { MenuItemCard } from '@compositions/MenuItemCard/MenuItemCard'
import { ProductDetail } from '@compositions/ProductDetail/ProductDetail'
import { StoreHeader } from '@compositions/StoreHeader/StoreHeader'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { useActiveSection } from '@hooks/useActiveSection'
import { useMenu } from '@hooks/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { useStore } from '@hooks/useStore'
import { useCartStore } from '@states/useCartStore'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { resolveSlug } from '@utils/resolve-slug'
import { isOpen } from '@utils/store-info'

import { MenuRowsSkeleton } from './MenuRowsSkeleton'
import { StorefrontSkeleton } from './StorefrontSkeleton'
import styles from './Storefront.module.css'

const sectionDomId = (id: string): string => `section-${id}`

export const Storefront = () => {
  const navigate = useNavigate()
  const { slug: pathSlug } = useParams()
  const slug = resolveSlug(pathSlug)
  const { store, isPending: loadingStore, isError } = useStore(slug ?? undefined)
  const { sections, isPending: loadingMenu } = useMenu(store?.id)
  const { hours, isPending: loadingHours } = useOpeningHours(store?.id)

  const activeId = useActiveSection(sections.map((section) => section.id))
  const cart = useCartStore((state) => state.lines)
  const addToCart = useCartStore((state) => state.add)
  const incrementCartLine = useCartStore((state) => state.increment)
  const decrementCartLine = useCartStore((state) => state.decrement)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const visibleSections = query
    ? sections
        .map((section) => ({
          ...section,
          items: section.items.filter(({ name }) =>
            name.toLowerCase().includes(query)
          ),
        }))
        .filter((section) => section.items.length > 0)
    : sections

  const handleConfirmDetail = (item: MenuItem, quantity: number) => {
    addToCart(item, quantity)
    setSelectedItem(null)
  }

  const cartLines = Object.values(cart)
  const cartCount = cartLines.reduce((total, line) => total + line.quantity, 0)
  const cartTotal = cartLines.reduce(
    (total, line) => total + Number(line.item.price) * line.quantity,
    0
  )

  const goToSection = (id: string) => {
    document
      .getElementById(sectionDomId(id))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!slug) {
    return (
      <div className={styles.notFound}>
        <img
          src="/mascot-consumer.svg"
          alt=""
          className={styles.notFoundMascot}
        />
        <h1 className={styles.notFoundTitle}>Qual loja você procura?</h1>
        <p className={styles.notFoundText}>
          Abra pelo link da loja — cada uma tem o seu endereço.
        </p>
      </div>
    )
  }

  if (loadingStore) return <StorefrontSkeleton />

  if (isError || !store) {
    return (
      <div className={styles.notFound}>
        <img
          src="/mascot-consumer-sad.svg"
          alt=""
          className={styles.notFoundMascot}
        />
        <h1 className={styles.notFoundTitle}>Loja não encontrada</h1>
        <p className={styles.notFoundText}>
          Confira o link — o endereço pode ter mudado ou a loja saiu do ar.
        </p>
      </div>
    )
  }

  const storeOpen = loadingHours || isOpen(store, hours)

  return (
    <div className={styles.page}>
      <StoreHeader store={store} hours={hours} />

      <ActiveOrderBanner slug={slug} />

      <div className={styles.body}>
        {sections.length > 0 && (
          <div className={styles.searchWrap}>
            <div className={styles.searchField}>
              <Icon svg={searchIcon} className={styles.searchIcon} />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar no cardápio…"
                className={styles.searchInput}
              />
            </div>
          </div>
        )}

        {sections.length > 0 && !query && (
          <aside className={styles.rail}>
            <CategoryNav
              sections={sections}
              activeId={activeId}
              onSelect={goToSection}
            />
          </aside>
        )}

        <main className={styles.menu}>
          {loadingMenu && <MenuRowsSkeleton />}

        {!loadingMenu && sections.length === 0 && (
          <p className={styles.hint}>
            Esta loja ainda não publicou itens no cardápio.
          </p>
        )}

        {!loadingMenu && query && visibleSections.length === 0 && (
          <p className={styles.hint}>Nada encontrado para “{search}”.</p>
        )}

        {visibleSections.map((section) => {
          const icon = categoryIcon(section.name)
          return (
            <section
              key={section.id}
              id={sectionDomId(section.id)}
              className={styles.section}
              aria-label={section.name}
            >
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>{section.name}</h2>
                <span className={styles.sectionCount}>
                  {section.items.length}{' '}
                  {section.items.length === 1 ? 'opção' : 'opções'}
                </span>
              </div>
              <div className={styles.items}>
                {section.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAdd={addToCart}
                    onSelect={setSelectedItem}
                    disabled={!storeOpen}
                    fallbackIcon={icon}
                  />
                ))}
              </div>
            </section>
            )
          })}
        </main>
      </div>

      {cartCount > 0 && (
        <button
          type="button"
          className={styles.cartBar}
          onClick={() => setIsCartOpen(true)}
        >
          <span className={styles.cartSummary}>
            <span className={styles.cartCount}>
              {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </span>
            <span className={styles.cartDot} aria-hidden="true">
              ·
            </span>
            <span className={styles.cartAction}>Ver sacola</span>
          </span>
          <span className={styles.cartCta}>
            {brl(cartTotal)}
            <svg
              className={styles.cartArrow}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M4 12h15m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      )}

      <CartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        lines={cartLines}
        total={cartTotal}
        onIncrement={incrementCartLine}
        onDecrement={decrementCartLine}
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
