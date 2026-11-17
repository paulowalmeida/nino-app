import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { Icon } from '@nino/ds/components/Icon'
import { Button } from '@nino/ds/components/Button'
import { Menu } from '@nino/ds/components/Menu'
import { Text } from '@nino/ds/components/Text'
import { useHasActiveOrder } from '@shared/hooks/useHasActiveOrder/useHasActiveOrder'
import { AccountDrawer } from './AccountDrawer/AccountDrawer'

import styles from './TabBar.module.css'

type TabBarProps = {
  base: string
  /** Quantos itens estão na sacola. Sem `onOpenCart`, o atalho não existe. */
  cartCount?: number
  /** Abre a sacola. Só a vitrine tem sacola, então o atalho é opcional. */
  onOpenCart?: () => void
  /** Abre a busca do cardápio. Só a vitrine tem cardápio, então é opcional. */
  onOpenSearch?: () => void
  /** Abre os cupons da loja. Só existe quando a vitrine tem oferta. */
  onOpenCoupons?: () => void
}

export const TabBar = ({
  base,
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
  onOpenCoupons,
}: TabBarProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const slug = base.startsWith('/') ? base.slice(1).split('/')[0] : undefined
  const hasActiveOrder = useHasActiveOrder(slug)

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
      {/* WHY: três abas para o que se usa a toda hora; o resto vai no Mais —
          seis alvos numa tela de 360px apertavam rótulo e polegar. */}
      <nav className={styles.bar} aria-label="Atalhos">
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
          <Text as="span" className={styles.tabBarLabel}>
            Início
          </Text>
        </Button>

        {onOpenSearch && (
          <Button
            variant="ghost"
            onClick={onOpenSearch}
            className={styles.tabBarTab}
            aria-label="Buscar no cardápio"
          >
            <Icon name="search" />
            <Text as="span" className={styles.tabBarLabel}>
              Busca
            </Text>
          </Button>
        )}

        {onOpenCart && (
          <Button
            variant="ghost"
            onClick={onOpenCart}
            className={styles.tabBarTab}
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
            <Text as="span" className={styles.tabBarLabel}>
              Sacola
            </Text>
          </Button>
        )}

        {/* tablet: cabe tudo na barra; o Mais só existe no celular */}
        {onOpenCoupons && (
          <Button
            variant="ghost"
            onClick={onOpenCoupons}
            aria-haspopup="dialog"
            className={`${styles.tabBarTab} ${styles.wideOnly}`}
          >
            <Icon name="tag" />
            <Text as="span" className={styles.tabBarLabel}>
              Cupons
            </Text>
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => void navigate(notifications)}
          aria-current={isNotifications ? 'page' : undefined}
          aria-label={
            hasActiveOrder ? 'Avisos — pedido em andamento' : 'Avisos'
          }
          className={`${styles.tabBarTab} ${styles.wideOnly} ${isNotifications ? styles.tabOn : ''}`}
        >
          <Text as="span" className={styles.moreIcon}>
            <Icon name="bell" />
            {hasActiveOrder && (
              <Text as="span" aria-hidden="true" className={styles.moreDot} />
            )}
          </Text>
          <Text as="span" className={styles.tabBarLabel}>
            Avisos
          </Text>
        </Button>

        <Button
          variant="ghost"
          onClick={() => setIsAccountOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isAccountOpen}
          className={`${styles.tabBarTab} ${styles.wideOnly} ${isAccount ? styles.tabOn : ''}`}
        >
          <Icon name="user" />
          <Text as="span" className={styles.tabBarLabel}>
            Perfil
          </Text>
        </Button>

        <Menu
          placement="top-end"
          trigger={
            <Button
              variant="ghost"
              aria-label={
                hasActiveOrder
                  ? 'Mais opções — pedido em andamento'
                  : 'Mais opções'
              }
              className={`${styles.tabBarTab} ${styles.narrowOnly} ${isAccount || isNotifications ? styles.tabOn : ''}`}
            >
              <Text as="span" className={styles.moreIcon}>
                <Icon name="more-horizontal" />
                {hasActiveOrder && (
                  <Text
                    as="span"
                    aria-hidden="true"
                    className={styles.moreDot}
                  />
                )}
              </Text>
              <Text as="span" className={styles.tabBarLabel}>
                Mais
              </Text>
            </Button>
          }
          items={[
            ...(onOpenCoupons
              ? [
                  {
                    value: 'coupons',
                    label: 'Cupons',
                    icon: <Icon name="tag" />,
                    onSelect: onOpenCoupons,
                  },
                ]
              : []),
            {
              value: 'notices',
              label: 'Avisos',
              icon: (
                <Text as="span" className={styles.moreIcon}>
                  <Icon name="bell" />
                  {hasActiveOrder && (
                    <Text
                      as="span"
                      aria-hidden="true"
                      className={styles.moreDot}
                    />
                  )}
                </Text>
              ),
              onSelect: () => void navigate(notifications),
            },
            {
              value: 'profile',
              label: 'Perfil',
              icon: <Icon name="user" />,
              onSelect: () => setIsAccountOpen(true),
            },
          ]}
        />
      </nav>

      <AccountDrawer
        open={isAccountOpen}
        onOpenChange={setIsAccountOpen}
        base={base}
      />
    </>
  )
}
