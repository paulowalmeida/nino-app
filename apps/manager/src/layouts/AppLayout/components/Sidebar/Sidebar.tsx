import { useSidemenu } from '@layouts/AppLayout/hooks/useSidemenu/useSidemenu'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useSessionStore } from '@shared/states/session/session.state'

import { SidebarNavigation } from './SidebarNavigation/SidebarNavigation'
import { StoreSwitcher } from './StoreSwitcher/StoreSwitcher'
import { UserMenu } from './UserMenu/UserMenu'

import styles from './Sidebar.module.css'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export const Sidebar = ({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const user = useSessionStore(({ user }) => user)
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { data: summary } = useQueueSummary(tenantId)
  const { groups, openSection, setOpenSection, isInside } = useSidemenu()

  const waiting = summary?.PENDING ?? 0
  const isCollapsed = collapsed && !isOpen

  const asideClass = mergeClasses(
    styles.sidebar,
    isOpen && styles.open,
    isCollapsed && styles.collapsed
  )

  return (
    <Box
      as="aside"
      direction="column"
      className={asideClass}
      data-collapsed={isCollapsed || undefined}
    >
      <Box direction="row" className={styles.topBar}>
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
          <Icon name="chevron-down" size="sm" className={styles.collapseIcon} />
        </Button>
      </Box>

      <Box className={styles.switcherWrap}>
        <StoreSwitcher currentTenantId={tenantId} collapsed={isCollapsed} />
      </Box>

      <SidebarNavigation
        groups={groups}
        tenantId={tenantId}
        isCollapsed={isCollapsed}
        waiting={waiting}
        openSection={openSection}
        onOpenSectionChange={setOpenSection}
        isInside={isInside}
        onNavigate={onClose}
      />

      <Box className={styles.footer}>
        <UserMenu
          name={user?.name ?? ''}
          tenantId={tenantId}
          onNavigate={onClose}
          collapsed={isCollapsed}
        />
      </Box>
    </Box>
  )
}
