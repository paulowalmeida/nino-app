import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Input } from '@nino/ds'

import bagIcon from '@assets/icons/bag.svg?raw'
import searchIcon from '@assets/icons/search.svg?raw'
import { Icon } from '@components/Icon/Icon'
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
import { brl } from '@utils/money'
import { resolveSlug } from '@utils/resolve-slug'
import { displayName, isOpen } from '@utils/store-info'

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

  if (!loadingHours && !isOpen(store, hours)) {
    return (
      <div className={styles.notFound}>
        <img
          src="/mascot-consumer.svg"
          alt=""
          className={styles.notFoundMascot}
        />
        <h1 className={styles.notFoundTitle}>{displayName(store)} fechou</h1>
        <p className={styles.notFoundText}>
          Fora do horário de funcionamento agora. Volta já já — passa aqui de
          novo daqui a pouco.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <StoreHeader store={store} hours={hours} />

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
        <CategoryNav
          sections={sections}
          activeId={activeId}
          onSelect={goToSection}
        />
      )}

      <main className={styles.menu}>
        {loadingMenu && <p className={styles.hint}>Carregando o cardápio…</p>}

        {!loadingMenu && sections.length === 0 && (
          <p className={styles.hint}>
            Esta loja ainda não publicou itens no cardápio.
          </p>
        )}

        {!loadingMenu && query && visibleSections.length === 0 && (
          <p className={styles.hint}>Nada encontrado para “{search}”.</p>
        )}

        {visibleSections.map((section) => (
          <section
            key={section.id}
            id={sectionDomId(section.id)}
            className={styles.section}
            aria-label={section.name}
          >
            <h2 className={styles.sectionTitle}>{section.name}</h2>
            <div className={styles.items}>
              {section.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAdd={addToCart}
                  onSelect={setSelectedItem}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {cartCount > 0 && (
        <div className={styles.cartBar}>
          <div className={styles.cartSummary}>
            <Icon svg={bagIcon} className={styles.cartIcon} />
            <span className={styles.cartText}>
              <span className={styles.cartCount}>
                {cartCount} {cartCount === 1 ? 'item' : 'itens'}
              </span>
              <span className={styles.cartTotal}>{brl(cartTotal)}</span>
            </span>
          </div>
          <button
            type="button"
            className={styles.cartCta}
            onClick={() => setIsCartOpen(true)}
          >
            Ver sacola
          </button>
        </div>
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
