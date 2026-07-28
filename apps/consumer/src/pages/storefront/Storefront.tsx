import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { AnimatedNumber } from '@components/AnimatedNumber/AnimatedNumber'
import { Icon } from '@components/Icon/Icon'
import { ActiveOrderBanner } from '@compositions/ActiveOrderBanner/ActiveOrderBanner'
import { CartDrawer } from '@compositions/CartDrawer/CartDrawer'
import { CategoryNav } from '@compositions/CategoryNav/CategoryNav'
import { MenuItemCard } from '@compositions/MenuItemCard/MenuItemCard'
import { PoweredBy } from '@compositions/PoweredBy/PoweredBy'
import { ProductDetail } from '@compositions/ProductDetail/ProductDetail'
import { StoreInfo } from '@compositions/StoreInfo/StoreInfo'
import { StoreTopBar } from '@compositions/StoreTopBar/StoreTopBar'
import { TabBar } from '@compositions/TabBar/TabBar'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { useActiveSection } from '@hooks/useActiveSection'
import { useMenu } from '@hooks/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { useScrollProgress } from '@hooks/useScrollProgress'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'
import { useCartStore } from '@states/useCartStore'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'
import { displayName, initials, isOpen } from '@utils/store-info'

import searchIcon from '@assets/icons/search.svg?raw'

import { MenuRowsSkeleton } from './MenuRowsSkeleton'
import { StorefrontSkeleton } from './StorefrontSkeleton'
import styles from './Storefront.module.css'
import motion from '@styles/motion.module.css'

const sectionDomId = (id: string): string => `section-${id}`

/**
 * Distância em que a transição do topo acontece: o suficiente para o azulejo
 * da logo sair de vista, e curta o bastante para a barra já estar montada
 * quando o primeiro item do cardápio chega.
 */
const HEADER_TRANSITION_PX = 140

export const Storefront = () => {
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
  const activeDomId = useActiveSection(
    sections.map((section) => sectionDomId(section.id))
  )
  const activeId = activeDomId?.replace(/^section-/, '') ?? null
  const cart = useCartStore((state) => state.lines)
  const addToCart = useCartStore((state) => state.add)
  const incrementCartLine = useCartStore((state) => state.increment)
  const decrementCartLine = useCartStore((state) => state.decrement)
  const clearCart = useCartStore((state) => state.clear)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
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
      <EmptyState
        size="md"
        className={styles.notFound}
        illustration={<img src="/mascot-consumer.svg" alt="" />}
        title="Qual loja você procura?"
      >
        Abra pelo link da loja — cada uma tem o seu endereço.
      </EmptyState>
    )
  }

  if (loadingStore) return <StorefrontSkeleton />

  if (isError || !store) {
    return (
      <EmptyState
        size="md"
        className={styles.notFound}
        illustration={<img src="/mascot-consumer-sad.svg" alt="" />}
        title="Loja não encontrada"
      >
        Confira o link — o endereço pode ter mudado ou a loja saiu do ar.
      </EmptyState>
    )
  }

  const storeOpen = loadingHours || isOpen(store, hours)
  const base = pathSlug ? `/${pathSlug}` : ''

  return (
    <div
      className={styles.page}
      style={
        {
          '--p': progress,
          ...(store.primaryColor
            ? { '--store-tint': store.primaryColor }
            : {}),
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

      {/* a faixa da loja sangra de ponta a ponta: é a primeira coisa que diz
          onde a pessoa está, e uma capa emoldurada não diz isso.
          Ela desenrola de cima para baixo — o mesmo gesto de comanda saindo
          da impressora que abre as telas do gestor. */}
      <div className={`${motion.unroll} ${styles.banner}`}>
        {store.logoUrl && (
          <img src={store.logoUrl} alt="" className={styles.bannerMark} />
        )}
        <div className={styles.bannerScrim} />
      </div>

      <div className={styles.shell}>
        <div className={styles.identityRow}>
          {/* sem classe de entrada aqui: o azulejo já tem `transform` ligado
              ao progresso da rolagem, e uma animação com fill both congelaria
              o valor final por cima dele, matando o merge com o topo */}
          <div className={styles.logoTile}>
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt=""
                className={styles.logoImg}
              />
            ) : (
              <span className={styles.logoFallback}>{initials(store)}</span>
            )}
          </div>

          <div className={styles.identity}>
            <h1 className={`${motion.deal} ${styles.name}`}>
              {displayName(store)}
            </h1>
            <p
              className={`${motion.deal} ${styles.identityMeta}`}
              style={riseDelay(70)}
            >
              <button
                type="button"
                className={styles.more}
                onClick={() => setIsInfoOpen(true)}
              >
                Ver mais
              </button>
              <span className={styles.sep}>·</span>
              <span className={styles.status}>
                <span
                  className={
                    storeOpen ? `${styles.dot} ${styles.dotOn}` : styles.dot
                  }
                  aria-hidden="true"
                />
                {storeOpen ? 'Aberto agora' : 'Fechado'}
              </span>
            </p>
          </div>
        </div>

        <ActiveOrderBanner slug={slug} />

        {sections.length > 0 && (
          <div className={styles.toolbar}>
            <div className={styles.searchField}>
              <Icon svg={searchIcon} className={styles.searchIcon} />
              <input
                ref={searchRef}
                type="search"
                aria-label="Buscar no cardápio"
                placeholder="Buscar no cardápio"
                className={styles.searchInput}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {settings?.estimatedMinutes ? (
              <div className={styles.fact}>
                <span className={styles.factLabel}>Entrega</span>
                <span className={styles.factValue}>
                  ~{settings.estimatedMinutes} min
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {sections.length > 0 && !query && (
        <div
          className={`${motion.settle} ${styles.categoryBar}`}
          style={riseDelay(140)}
        >
          <div className={styles.categoryInner}>
            <CategoryNav
              sections={sections}
              activeId={activeId}
              onSelect={goToSection}
            />
          </div>
        </div>
      )}

      <main className={styles.shell}>
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

          {!loadingMenu && query && visibleSections.length === 0 && (
            <EmptyState className={styles.empty}>
              Nada encontrado para “{search}”.
            </EmptyState>
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
                      quantity={cart[item.id]?.quantity ?? 0}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      {cartCount > 0 && (
        <div className={styles.cartBar}>
          <div className={styles.cartInner}>
            <div className={styles.cartTotals}>
              <span className={styles.cartCount}>
                {cartCount} {cartCount === 1 ? 'item' : 'itens'}
                {settings?.estimatedMinutes ? (
                  <>
                    {' · '}
                    <span className={styles.cartEta}>
                      pronto em ~{settings.estimatedMinutes} min
                    </span>
                  </>
                ) : null}
              </span>
              <AnimatedNumber
                value={brl(cartTotal)}
                className={styles.cartTotal}
              />
            </div>
            <Button
              className={styles.cartCta}
              onClick={() => setIsCartOpen(true)}
            >
              <span className={styles.cartCtaCount}>{cartCount}</span>
              Ver sacola
              <span className={styles.cartCtaTotal}>{brl(cartTotal)}</span>
            </Button>
          </div>
        </div>
      )}

      <div className={styles.shell}>
        <PoweredBy />
      </div>

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
