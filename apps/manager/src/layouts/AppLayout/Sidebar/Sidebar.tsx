import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'

import { NinoLogo } from '@elements/NinoLogo/NinoLogo'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { Accordion } from '@nino/ds/components/Accordion'
import { Icon } from '@nino/ds/components/Icon'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { useSessionStore } from '@states/useSessionStore'
import { riseDelay } from '@utils/rise-delay'

import { StoreSwitcher } from '../StoreSwitcher'
import { UserMenu } from '../UserMenu'

import type { SidebarProps } from './Sidebar.types'

import motion from '@styles/motion.module.css'
import styles from './Sidebar.module.css'
import { SIDEMENU_GROUPS } from '@constants/sidemenu.constants'

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
    const inside = SIDEMENU_GROUPS.flatMap(({ items }) => items).find(
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
          <Icon name="chevron-down" className={styles.collapseIcon} />
        </button>
      </div>

      <div className={styles.switcherWrap}>
        <StoreSwitcher currentTenantId={tenantId} collapsed={isCollapsed} />
      </div>

      <ScrollArea fadeEdges className={styles.nav}>
        <nav className={styles.navInner}>
          {SIDEMENU_GROUPS.map(({ title, items }) => (
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
                      <Icon name={icon} className={styles.navIcon} />
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
                                    ({
                                      to,
                                      label: childLabel,
                                      icon: childIcon,
                                    }) => (
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
                                        <Icon
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
      </ScrollArea>

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
