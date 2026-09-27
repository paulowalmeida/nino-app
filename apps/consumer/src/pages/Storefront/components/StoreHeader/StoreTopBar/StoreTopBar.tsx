import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { Menu } from '@nino/ds/components/Menu'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Input } from '@nino/ds/components/Input'
import { Button } from '@nino/ds/components/Button'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { displayName, isOpen, storeInitials } from '@utils/store-info'
import { firstName } from '@shared/utils/consumer-name/consumer-name'
import { formatPhone } from '@utils/phone'
import { storeThemeLogoUrl } from '@utils/store-theme/store-theme'

import styles from './StoreTopBar.module.css'

type StoreTopBarProps = {
  slug: string
  /** Verdadeiro quando a busca da página já passou por baixo do topo. */
  isDocked: boolean
}
export const StoreTopBar = ({ slug, isDocked }: StoreTopBarProps) => {
  const {
    store,
    sections,
    cartCount,
    setCartOpen,
    search,
    setSearch,
    consumer,
    logout,
    hours,
    isHoursPending,
    setInfoOpen,
  } = useStorefrontFacade()
  const navigate = useNavigate()
  const [isSearchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus()
  }, [isSearchOpen])

  /* WHY: fechar sem limpar deixava o cardápio filtrado por um texto que não
     está mais em lugar nenhum da tela, com a régua de categorias escondida. */
  const closeSearch = () => {
    setSearch('')
    setSearchOpen(false)
  }

  if (!store) return null

  const base = slug ? `/${slug}` : ''
  const go = (path: string) => () => void navigate(`${base}${path}`)

  /* o primeiro nome basta na barra: nome inteiro estoura a coluna e vira
     reticências, que não identificam ninguém */
  const named = consumer?.profileCompletedAt
    ? (firstName(consumer.name) ?? consumer.name)
    : formatPhone(consumer?.phone ?? '')

  const isStoreOpen = isHoursPending || isOpen(store, hours)
  const logoUrl = storeThemeLogoUrl(store)

  return (
    <Box
      as="header"
      className={isDocked ? `${styles.bar} ${styles.barDocked}` : styles.bar}
    >
      <Box direction="row" className={styles.inner}>
        <a href={base || '/'} className={styles.brand}>
          <Box className={styles.logo} aria-hidden="true">
            <Image
              src={logoUrl}
              alt=""
              className={styles.logoImg}
              wrapperClassName={styles.logoStack}
              placeholder={
                logoUrl ? (
                  <Box className={styles.logoPlaceholder} aria-hidden="true" />
                ) : (
                  <Box className={styles.logoFallback} aria-hidden="true">
                    {storeInitials(store)}
                  </Box>
                )
              }
            />
          </Box>
          <Text as="span" className={styles.storeName}>
            {displayName(store)}
          </Text>
        </a>

        {sections.length > 0 && (
          <Box className={styles.deskSearch}>
            <Icon name="search" className={styles.searchIcon} />
            <Input
              type="search"
              aria-label="Buscar no cardápio"
              placeholder="Buscar no cardápio"
              className={styles.searchInput}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Box>
        )}

        <Box direction="row" className={styles.tools}>
          <Box direction="row" className={styles.storeMeta}>
            <Text
              as="span"
              className={
                isStoreOpen
                  ? `${styles.metaStatus} ${styles.metaStatusOn}`
                  : styles.metaStatus
              }
            >
              <span
                className={
                  isStoreOpen ? `${styles.dot} ${styles.dotOn}` : styles.dot
                }
                aria-hidden="true"
              />
              {isStoreOpen ? 'Aberto agora' : 'Fechado'}
            </Text>
          </Box>

          {sections.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className={`${styles.iconBtn} ${styles.searchTrigger}`}
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar no cardápio"
              aria-expanded={isSearchOpen}
            >
              <Icon name="search" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={`${styles.iconBtn} ${styles.infoEntry}`}
            onClick={() => setInfoOpen(true)}
            aria-label="Informações da loja"
          >
            <Icon name="info" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`${styles.iconBtn} ${styles.notificationsEntry}`}
            onClick={go('/conta/conversas')}
            aria-label="Conversas com a loja"
          >
            <Icon name="bell" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`${styles.iconBtn} ${styles.cartEntry}`}
            onClick={() => setCartOpen(true)}
            aria-label={
              cartCount > 0
                ? `Sacola com ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`
                : 'Sacola vazia'
            }
          >
            <Icon name="shopping-cart" />
            {cartCount > 0 && (
              <Text as="span" className={styles.cartBadge}>
                {cartCount}
              </Text>
            )}
          </Button>

          {consumer ? (
            <Menu
              contentClassName={styles.menuPanel}
              trigger={
                <Button
                  variant="ghost"
                  className={`${styles.account} ${styles.accountEntry}`}
                  aria-label={`Sua conta — ${named}`}
                >
                  {consumer.photoUrl ? (
                    <Image
                      src={consumer.photoUrl}
                      alt=""
                      className={styles.accountPhoto}
                      wrapperClassName={styles.accountPhotoWrap}
                      placeholder={
                        <Box
                          className={styles.accountPhotoPlaceholder}
                          aria-hidden="true"
                        />
                      }
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Icon name="user" />
                  )}
                  <Text as="span" className={styles.accountName}>
                    {named}
                  </Text>
                </Button>
              }
              items={[
                {
                  value: 'orders',
                  label: 'Pedidos',
                  icon: <Icon name="bag" />,
                  onSelect: go('/conta/pedidos'),
                },
                {
                  value: 'addresses',
                  label: 'Endereços',
                  icon: <Icon name="map-pin" />,
                  onSelect: go('/conta/enderecos'),
                },
                {
                  value: 'payment',
                  label: 'Pagamento',
                  icon: <Icon name="credit-card" />,
                  onSelect: go('/conta/pagamento'),
                },
                {
                  value: 'profile',
                  label: 'Meus dados',
                  icon: <Icon name="user" />,
                  onSelect: go('/conta/dados'),
                },
                { separator: true },
                {
                  value: 'logout',
                  label: 'Sair',
                  icon: <Icon name="logout" />,
                  destructive: true,
                  onSelect: logout,
                },
              ]}
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={`${styles.signIn} ${styles.accountEntry}`}
              onClick={go('/entrar')}
              aria-label="Entrar na sua conta"
            >
              <Icon name="user" />
            </Button>
          )}
        </Box>

        {sections.length > 0 && (
          <Box
            direction="row"
            className={
              isSearchOpen
                ? `${styles.searchPanel} ${styles.searchPanelOpen}`
                : styles.searchPanel
            }
            aria-hidden={!isSearchOpen}
          >
            <Box className={styles.searchField}>
              <Icon name="search" className={styles.searchIcon} />
              <Input
                ref={searchRef}
                type="search"
                aria-label="Buscar no cardápio"
                placeholder="Buscar no cardápio"
                className={styles.searchInput}
                value={search}
                tabIndex={isSearchOpen ? undefined : -1}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') closeSearch()
                }}
              />
            </Box>
            <Button
              variant="ghost"
              size="icon"
              className={styles.iconBtn}
              onClick={closeSearch}
              aria-label="Fechar busca"
              tabIndex={isSearchOpen ? undefined : -1}
            >
              <Icon name="x" />
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
