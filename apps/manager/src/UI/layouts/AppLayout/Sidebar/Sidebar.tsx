import { NinoLogo } from '@atoms/NinoLogo/NinoLogo'
import { SidebarNavigation } from '@organisms/SidebarNavigation/SidebarNavigation'
import { StoreSwitcher } from '@organisms/StoreSwitcher/StoreSwitcher'
import { UserMenu } from '@organisms/UserMenu/UserMenu'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSidemenu } from '@hooks/session/useSidemenu'
import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { useSessionStore } from '@states/useSessionStore'

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
