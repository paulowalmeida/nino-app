import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'

import { Icon } from '@nino/ds/components/Icon'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { AccountDrawer } from './AccountDrawer/AccountDrawer'

import styles from './TabBar.module.css'

type TabBarProps = {
  base: string
}

export const TabBar = ({ base }: TabBarProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const home = base || '/'
  const isHome = pathname === home || pathname === `${home}/`
  const orders = `${base}/conta/pedidos`

  const isAccount =
    isAccountOpen ||
    (pathname.startsWith(`${base}/conta`) && !pathname.startsWith(orders))

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
        <NavLink
          to={orders}
          className={({ isActive }) =>
            isActive && !isAccountOpen
              ? `${styles.tab} ${styles.tabOn}`
              : styles.tab
          }
        >
          <Icon name="bag" />
          <Text as="span" className={styles.label}>
            Pedidos
          </Text>
        </NavLink>

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
