import { NavLink } from 'react-router'

import { NavIcon } from '@components/NavIcon'
import { NinoLogo } from '@components/NinoLogo'
import type { NavIconName } from '@components/NavIcon/NavIcon.types'
import { logout } from '@services/auth/auth.service'
import { useSessionStore } from '@states/useSessionStore'
import { endSession } from '@utils/end-session'

import { StoreSwitcher } from '../StoreSwitcher'

import type { SidebarProps } from './Sidebar.types'

import styles from './Sidebar.module.css'

const NAV: { section: string; label: string; icon: NavIconName }[] = [
  { section: 'visao-geral', label: 'Visão geral', icon: 'grid' },
  { section: 'pedidos', label: 'Pedidos', icon: 'bag' },
  { section: 'catalogo', label: 'Cardápio', icon: 'clipboard' },
  { section: 'colaboradores', label: 'Colaboradores', icon: 'users' },
  { section: 'configuracoes', label: 'Configurações', icon: 'gear' },
]

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()

export const Sidebar = ({ tenantId, isOpen, onClose }: SidebarProps) => {
  const user = useSessionStore(({ user }) => user)

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // a sessão local é encerrada mesmo se a API não responder
    }
    endSession()
  }

  return (
    <aside className={isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}>
      <div className={styles.logoWrap}>
        <NinoLogo size="sm" tone="light" />
      </div>

      <div className={styles.switcherWrap}>
        <StoreSwitcher currentTenantId={tenantId} />
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ section, label, icon }) => (
          <NavLink
            key={section}
            to={`/${tenantId}/${section}`}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            <NavIcon name={icon} className={styles.navIcon} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initialsOf(user?.name ?? '')}</div>
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
