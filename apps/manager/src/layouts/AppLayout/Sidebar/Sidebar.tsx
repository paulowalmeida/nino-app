import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'

import { NavIcon } from '@components/NavIcon'
import { NinoLogo } from '@components/NinoLogo'
import type { NavIconName } from '@components/NavIcon/NavIcon.types'
import { MANAGERS } from '@constants/roles'
import { SETTINGS_SECTIONS } from '@constants/settings-sections'
import type { TenantRole } from '@custom_types/auth'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { useTenantRole } from '@hooks/session/useTenantRole'
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
  /** Papéis que enxergam o item; ausente = todo mundo da loja. */
  roles?: TenantRole[]
}



/**
 * Two groups: what the store does today, and how the store is set up. The
 * split keeps the daily work at the top, where the hand goes first.
 */
const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Do dia',
    items: [
      {
        section: 'visao-geral',
        label: 'Visão geral',
        icon: 'grid',
        roles: MANAGERS,
      },
      { section: 'balcao', label: 'Balcão', icon: 'store' },
      { section: 'cozinha', label: 'Cozinha', icon: 'clipboard' },
      { section: 'pedidos', label: 'Pedidos', icon: 'bag' },
      { section: 'catalogo', label: 'Cardápio', icon: 'clipboard' },
    ],
  },
  {
    title: 'Da loja',
    items: [
      {
        section: 'clientes',
        label: 'Clientes',
        icon: 'users',
        roles: MANAGERS,
      },
      {
        section: 'colaboradores',
        label: 'Equipe',
        icon: 'store',
        roles: MANAGERS,
      },
      {
        section: 'configuracoes',
        label: 'Configurações',
        icon: 'gear',
        children: SETTINGS_SECTIONS,
        roles: MANAGERS,
      },
    ],
  },
]

export const Sidebar = ({ tenantId, isOpen, onClose }: SidebarProps) => {
  const user = useSessionStore(({ user }) => user)
  const { pathname } = useLocation()

  const role = useTenantRole()
  const { data: summary } = useQueueSummary(tenantId)

  const waiting = summary?.PENDING ?? 0

  /**
   * Item com filhos abre a lista, não uma tela: quem escolhe a seção é a
   * pessoa. Nasce aberto quando já se está dentro dele.
   */
  const [opened, setOpened] = useState<string | null>(() => {
    const inside = GROUPS.flatMap(({ items }) => items).find(
      ({ children, section }) => children && pathname.includes(`/${section}`)
    )
    return inside?.section ?? null
  })

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

            {items
              .filter(({ roles }) => !roles || (role && roles.includes(role)))
              .map(({ section, label, icon, children }) => {
                const delay = riseDelay(order++ * 55 + 120)
                const isInside = pathname.includes(`/${section}`)
                const isOpen = children ? opened === section : false

                const content = (
                  <>
                    <NavIcon name={icon} className={styles.navIcon} />
                    <span>{label}</span>
                    {section === 'pedidos' && waiting > 0 && (
                      <span className={`${motion.pop} ${styles.tally}`}>
                        {waiting}
                      </span>
                    )}
                  </>
                )

                return (
                  <div key={section}>
                    {children ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`sub-${section}`}
                        style={delay}
                        className={
                          isInside
                            ? `${motion.slide} ${styles.navItem} ${styles.navItemActive}`
                            : `${motion.slide} ${styles.navItem}`
                        }
                        onClick={() =>
                          setOpened((current) =>
                            current === section ? null : section
                          )
                        }
                      >
                        {content}
                      </button>
                    ) : (
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
                        {content}
                      </NavLink>
                    )}

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
