import { NavLink } from 'react-router'

import { NavIcon } from '@components/NavIcon'
import { NinoLogo } from '@components/NinoLogo'
import { PersonMark } from '@components/PersonMark'
import type { NavIconName } from '@components/NavIcon/NavIcon.types'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { logout } from '@services/auth/auth.service'
import { useSessionStore } from '@states/useSessionStore'
import { endSession } from '@utils/end-session'
import { riseDelay } from '@utils/rise-delay'

import { StoreSwitcher } from '../StoreSwitcher'

import type { SidebarProps } from './Sidebar.types'

import styles from './Sidebar.module.css'
import motion from '@styles/motion.module.css'

type NavItem = {
  section: string
  label: string
  icon: NavIconName
}

/**
 * Two groups: what the store does today, and how the store is set up. The
 * split keeps the daily work at the top, where the hand goes first.
 */
const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Do dia',
    items: [
      { section: 'visao-geral', label: 'Visão geral', icon: 'grid' },
      { section: 'pedidos', label: 'Pedidos', icon: 'bag' },
      { section: 'catalogo', label: 'Cardápio', icon: 'clipboard' },
    ],
  },
  {
    title: 'Da loja',
    items: [
      { section: 'colaboradores', label: 'Equipe', icon: 'users' },
      { section: 'configuracoes', label: 'Configurações', icon: 'gear' },
    ],
  },
]

export const Sidebar = ({ tenantId, isOpen, onClose }: SidebarProps) => {
  const user = useSessionStore(({ user }) => user)
  const { data: summary } = useQueueSummary(tenantId)

  const waiting = summary?.PENDING ?? 0

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // a sessão local é encerrada mesmo se a API não responder
    }
    endSession()
  }

  let order = 0

  return (
    <aside
      className={isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}
    >
      <div className={styles.logoWrap}>
        <NinoLogo size="sm" tone="light" />
      </div>

      <div className={styles.switcherWrap}>
        <StoreSwitcher currentTenantId={tenantId} />
      </div>

      <nav className={styles.nav}>
        {GROUPS.map(({ title, items }) => (
          <div key={title} className={styles.group}>
            <p className={styles.groupTitle}>{title}</p>

            {items.map(({ section, label, icon }) => {
              const delay = riseDelay(order++ * 55 + 120)

              return (
                <NavLink
                  key={section}
                  to={`/${tenantId}/${section}`}
                  onClick={onClose}
                  style={delay}
                  className={({ isActive }) =>
                    isActive
                      ? `${motion.slide} ${styles.navItem} ${styles.navItemActive}`
                      : `${motion.slide} ${styles.navItem}`
                  }
                >
                  <NavIcon name={icon} className={styles.navIcon} />
                  <span>{label}</span>
                  {section === 'pedidos' && waiting > 0 && (
                    <span className={`${motion.pop} ${styles.tally}`}>
                      {waiting}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <PersonMark name={user?.name ?? ''} tone="night" size="sm" />
          <span className={styles.userName}>{user?.name.split(' ')[0]}</span>
        </div>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Sair"
          title="Sair"
        >
          <NavIcon name="logout" className={styles.navIcon} />
        </button>
      </div>
    </aside>
  )
}
