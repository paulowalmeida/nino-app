import { useNavigate } from 'react-router'

import { Menu } from '@nino/ds/components/Menu'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Input } from '@nino/ds/components/Input'
import { Button } from '@nino/ds/components/Button'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { displayName, storeInitials } from '@utils/store-info'
import { formatPhone } from '@utils/phone'

import styles from './StoreTopBar.module.css'

type StoreTopBarProps = {
  slug: string
  progress: number
}
export const StoreTopBar = ({ slug, progress }: StoreTopBarProps) => {
  const {
    store,
    cartCount,
    setCartOpen,
    sections,
    search,
    setSearch,
    customer,
    logout,
  } = useStorefrontFacade()
  const navigate = useNavigate()
  if (!store) return null

  const base = slug ? `/${slug}` : ''
  const go = (path: string) => () => void navigate(`${base}${path}`)

  const named = customer?.profileCompletedAt
    ? customer.name
    : formatPhone(customer?.phone ?? '')

  return (
    <Box
      as="header"
      className={styles.bar}
      style={{ '--p': progress } as React.CSSProperties}
    >
      <Box className={styles.inner}>
        <a href={base || '/'} className={styles.brand}>
          <Box className={styles.logo} aria-hidden="true">
            <Image
              src={store.logoUrl}
              alt=""
              className={styles.logoImg}
              placeholder={storeInitials(store)}
            />
          </Box>
          <Text as="span" className={styles.storeName}>
            {displayName(store)}
          </Text>
        </a>

        {sections.length > 0 && (
          <Box className={styles.search}>
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

        <Box className={styles.tools}>
          <Button
            variant="ghost"
            size="icon"
            className={styles.iconBtn}
            onClick={() => setCartOpen(true)}
            aria-label={`Sacola com ${cartCount} ${
              cartCount === 1 ? 'item' : 'itens'
            }`}
          >
            <Icon name="bag" />
            {cartCount > 0 && (
              <Text as="span" className={styles.badge}>
                {cartCount}
              </Text>
            )}
          </Button>

          {customer ? (
            <Menu
              contentClassName={styles.menuPanel}
              trigger={
                <Button
                  variant="ghost"
                  className={styles.account}
                  aria-label={`Sua conta — ${named}`}
                >
                  <Icon name="user" />
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
              className={styles.signIn}
              onClick={go('/entrar')}
            >
              Entrar
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
