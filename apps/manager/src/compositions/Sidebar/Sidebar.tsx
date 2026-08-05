import { useState } from 'react'
import { useLocation } from 'react-router'

import { NinoLogo } from '@elements/NinoLogo/NinoLogo'
import { SidebarNavItem } from '@components/SidebarNavItem/SidebarNavItem'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { useTenantRole } from '@hooks/session/useTenantRole'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { useSessionStore } from '@states/useSessionStore'
import { riseDelay } from '@utils/rise-delay'
import { SIDEMENU_GROUPS } from '@constants/sidemenu.constants'

import { StoreSwitcher } from '../StoreSwitcher/StoreSwitcher'
import { UserMenu } from '../UserMenu/UserMenu'

import styles from './Sidebar.module.css'

type SidebarProps = {
  tenantId: string | null
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

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

  const isCollapsed = collapsed && !isOpen

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
        <Button
          variant="ghost"
          size="icon"
          className={styles.collapseBtn}
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <Icon name="chevron-down" className={styles.collapseIcon} />
        </Button>
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
                .map((item) => (
                  <SidebarNavItem
                    key={item.section}
                    tenantId={tenantId}
                    item={item}
                    isCollapsed={isCollapsed}
                    isInside={pathname.includes(`/${item.section}`)}
                    isOpen={
                      item.children ? opened === item.section : false
                    }
                    onOpenChange={(open) =>
                      setOpened(open ? item.section : null)
                    }
                    delay={riseDelay(order++ * 55 + 120)}
                    waiting={waiting}
                    onNavigate={onClose}
                  />
                ))}
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
