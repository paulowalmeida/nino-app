import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { Icon } from '@nino/ds/components/Icon'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { useGuestOrders } from '@shared/hooks/useGuestOrders/useGuestOrders'
import { AccountDrawer } from './AccountDrawer/AccountDrawer'

import styles from './TabBar.module.css'

type TabBarProps = {
  base: string
  /** Quantos itens estão na sacola. Sem `onOpenCart`, o atalho não existe. */
  cartCount?: number
  /** Abre a sacola. Só a vitrine tem sacola, então o atalho é opcional. */
  onOpenCart?: () => void
}

export const TabBar = ({ base, cartCount = 0, onOpenCart }: TabBarProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const slug = base.startsWith('/') ? base.slice(1).split('/')[0] : undefined
  const guestOrders = useGuestOrders(slug)

  const home = base || '/'
  const isHome = pathname === home || pathname === `${home}/`
  const notifications = `${base}/conta/conversas`
  const isNotifications = pathname.startsWith(notifications)
  const isAccount =
    isAccountOpen || (pathname.startsWith(`${base}/conta`) && !isNotifications)

  const handleHome = () => {
    if (!isHome) {
      navigate(home)
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' })
  }

  return (
    <>
      <nav className={styles.bar} aria-label="Atalhos">
        {onOpenCart && (
          <Button
            variant="ghost"
            onClick={onOpenCart}
            className={styles.tab}
            aria-label={
              cartCount > 0
                ? `Sacola com ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`
                : 'Sacola vazia'
            }
          >
            <Text as="span" className={styles.cartIcon}>
              <Icon name="bag" />
              {cartCount > 0 && (
                <Text as="span" className={styles.cartBadge}>
                  {cartCount}
                </Text>
              )}
            </Text>
            <Text as="span" className={styles.label}>
              Sacola
            </Text>
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={handleHome}
          aria-current={isHome ? 'page' : undefined}
          aria-label={isHome ? 'Voltar ao topo do cardápio' : 'Ir ao cardápio'}
          className={isHome ? `${styles.home} ${styles.homeOn}` : styles.home}
        >
          <Text as="span" className={styles.homeRing}>
            <Icon name="home" />
          </Text>
          <Text as="span" className={styles.label}>
            Início
          </Text>
        </Button>

        {guestOrders.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => void navigate(notifications)}
            aria-current={isNotifications ? 'page' : undefined}
            className={
              isNotifications ? `${styles.tab} ${styles.tabOn}` : styles.tab
            }
          >
            <Icon name="receipt" />
            <Text as="span" className={styles.label}>
              Pedido
            </Text>
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => setIsAccountOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isAccountOpen}
          className={isAccount ? `${styles.tab} ${styles.tabOn}` : styles.tab}
        >
          <Icon name="user" />
          <Text as="span" className={styles.label}>
            Perfil
          </Text>
        </Button>
      </nav>

      <AccountDrawer
        open={isAccountOpen}
        onOpenChange={setIsAccountOpen}
        base={base}
      />
    </>
  )
}
