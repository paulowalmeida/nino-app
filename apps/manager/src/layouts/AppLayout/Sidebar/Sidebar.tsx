import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'

import { NavIcon } from '@components/NavIcon'
import { NinoLogo } from '@components/NinoLogo'
import type { NavIconName } from '@components/NavIcon/NavIcon.types'
import { SETTINGS_SECTIONS } from '@constants/settings-sections'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { useSessionStore } from '@states/useSessionStore'
import { riseDelay } from '@utils/rise-delay'

import { StoreSwitcher } from '../StoreSwitcher'
import { UserMenu } from '../UserMenu'

import type { SidebarProps } from './Sidebar.types'

import styles from './Sidebar.module.css'
import motion from '@styles/motion.module.css'

type NavItem = {
  section: string
  label: string
  icon: NavIconName
  /** Seções internas — aparecem quando o item está aberto. */
  children?: { to: string; label: string }[]
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
      {
        section: 'configuracoes',
        label: 'Configurações',
        icon: 'gear',
        children: SETTINGS_SECTIONS,
      },
    ],
  },
]

export const Sidebar = ({ tenantId, isOpen, onClose }: SidebarProps) => {
  const user = useSessionStore(({ user }) => user)
  const { pathname } = useLocation()

  /** A seção da rota atual nasce aberta; o resto o usuário controla. */
  const [expanded, setExpanded] = useState<string[]>(() =>
    GROUPS.flatMap(({ items }) => items)
      .filter(({ children, section }) => children && pathname.includes(section))
      .map(({ section }) => section)
  )

  const toggle = (section: string) =>
    setExpanded((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section]
    )
  const { data: summary } = useQueueSummary(tenantId)

  const waiting = summary?.PENDING ?? 0

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

            {items.map(({ section, label, icon, children }) => {
              const delay = riseDelay(order++ * 55 + 120)
              const isOpen = expanded.includes(section)

              return (
                <div key={section}>
                  <div className={styles.navRow}>
                    <NavLink
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

                    {children && (
                      <button
                        type="button"
                        aria-label={
                          isOpen
                            ? `Recolher ${label}`
                            : `Expandir ${label}`
                        }
                        aria-expanded={isOpen}
                        aria-controls={`sub-${section}`}
                        className={styles.disclosure}
                        onClick={() => toggle(section)}
                      >
                        <NavIcon
                          name="chevron"
                          className={
                            isOpen
                              ? `${styles.chevron} ${styles.chevronOpen}`
                              : styles.chevron
                          }
                        />
                      </button>
                    )}
                  </div>

                  {children && isOpen && (
                    <div
                      id={`sub-${section}`}
                      className={`${motion.unroll} ${styles.subNav}`}
                    >
                      {children.map(({ to, label: childLabel }) => (
                        <NavLink
                          key={to}
                          to={`/${tenantId}/${section}/${to}`}
                          onClick={onClose}
                          className={({ isActive }) =>
                            isActive
                              ? `${styles.subItem} ${styles.subItemActive}`
                              : styles.subItem
                          }
                        >
                          {childLabel}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <UserMenu
          name={user?.name ?? ''}
          tenantId={tenantId}
          onNavigate={onClose}
        />
      </div>

    </aside>
  )
}
