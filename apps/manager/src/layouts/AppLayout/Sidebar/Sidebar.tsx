import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'

import { Accordion } from '@nino/ds/components/Accordion'
import { NavIcon } from '@components/NavIcon'
import { NinoLogo } from '@components/NinoLogo'
import { MANAGERS } from '@constants/roles'
import { SETTINGS_SECTIONS } from '@constants/settings-sections'
import type { NavItem } from '@custom_types/ui'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { useSessionStore } from '@states/useSessionStore'
import { riseDelay } from '@utils/rise-delay'

import { StoreSwitcher } from '../StoreSwitcher'
import { UserMenu } from '../UserMenu'

import type { SidebarProps } from './Sidebar.types'

import styles from './Sidebar.module.css'
import motion from '@styles/motion.module.css'

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
        icon: 'gauge',
        roles: MANAGERS,
      },
      { section: 'balcao', label: 'Balcão', icon: 'register' },
      { section: 'cozinha', label: 'Cozinha', icon: 'chef' },
      { section: 'pedidos', label: 'Pedidos', icon: 'bag' },
      { section: 'catalogo', label: 'Cardápio', icon: 'book' },
    ],
  },
  {
    title: 'Da loja',
    items: [
      {
        section: 'relatorios',
        label: 'Relatórios',
        icon: 'chart',
        roles: MANAGERS,
      },
      {
        section: 'clientes',
        label: 'Clientes',
        icon: 'users',
        roles: MANAGERS,
      },
      {
        section: 'colaboradores',
        label: 'Equipe',
        icon: 'badge',
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

export const Sidebar = ({
  tenantId,
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const user = useSessionStore(({ user }) => user)
  const { pathname } = useLocation()

  const role = useTenantRole()
  const { data: summary } = useQueueSummary(tenantId)

  const waiting = summary?.PENDING ?? 0

  /**
   * `collapsed` é preferência de desktop. No drawer mobile aberto (`isOpen`)
   * o texto sempre aparece — não faz sentido colapsar uma folha que já
   * ocupa a tela inteira.
   */
  const isCollapsed = collapsed && !isOpen

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

  const asideClass = [
    styles.sidebar,
    isOpen && styles.open,
    isCollapsed && styles.collapsed,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={asideClass}>
      <div className={styles.logoWrap}>
        <NinoLogo
          size="sm"
          tone="light"
          to={`/${tenantId}/visao-geral`}
          hideWordmark={isCollapsed}
        />
        <button
          type="button"
          className={styles.collapseBtn}
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <NavIcon name="chevron" className={styles.collapseIcon} />
        </button>
      </div>

      <div className={styles.switcherWrap}>
        <StoreSwitcher currentTenantId={tenantId} collapsed={isCollapsed} />
      </div>

      <nav className={styles.nav}>
        {GROUPS.map(({ title, items }) => (
          <div key={title} className={styles.group}>
            {!isCollapsed && <p className={styles.groupTitle}>{title}</p>}

            {items
              .filter(({ roles }) => !roles || (role && roles.includes(role)))
              .map(({ section, label, icon, children }) => {
                const delay = riseDelay(order++ * 55 + 120)
                const isInside = pathname.includes(`/${section}`)
                /* An accordion trigger only carries the active surface while
                   open — collapsed it stays invisible, even on its route. */
                const isOpen = children ? opened === section : false

                const content = (
                  <>
                    <NavIcon name={icon} className={styles.navIcon} />
                    {!isCollapsed && <span>{label}</span>}
                    {section === 'pedidos' && waiting > 0 && (
                      <span className={`${motion.pop} ${styles.tally}`}>
                        {waiting}
                      </span>
                    )}
                  </>
                )

                return (
                  <div key={section} style={delay} className={motion.slide}>
                    {children ? (
                      <Accordion
                        items={[
                          {
                            value: section,
                            trigger: (
                              <span className={styles.triggerContent}>
                                {content}
                              </span>
                            ),
                            content: (
                              <div className={styles.subNav}>
                                {children.map(
                                  ({ to, label: childLabel, icon: childIcon }) => (
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
                                      <NavIcon
                                        name={childIcon}
                                        className={styles.subIcon}
                                      />
                                      {!isCollapsed && (
                                        <span>{childLabel}</span>
                                      )}
                                    </NavLink>
                                  )
                                )}
                              </div>
                            ),
                          },
                        ]}
                        value={isOpen ? [section] : []}
                        onValueChange={(values) =>
                          setOpened(values.includes(section) ? section : null)
                        }
                        className={styles.accordionRoot}
                        itemClassName={styles.accordionItem}
                        triggerClassName={
                          isInside && isOpen
                            ? `${styles.navItemTrigger} ${styles.navItemActive}`
                            : styles.navItemTrigger
                        }
                        contentClassName={styles.accordionContent}
                      />
                    ) : (
                      <NavLink
                        to={`/${tenantId}/${section}`}
                        onClick={onClose}
                        className={({ isActive }) =>
                          isActive
                            ? `${styles.navItem} ${styles.navItemActive}`
                            : styles.navItem
                        }
                      >
                        {content}
                      </NavLink>
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
          collapsed={isCollapsed}
        />
      </div>
    </aside>
  )
}
