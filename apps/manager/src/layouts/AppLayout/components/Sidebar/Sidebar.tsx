import { useSidemenu } from '@layouts/AppLayout/hooks/useSidemenu/useSidemenu'
import { Box } from '@nino/ds/components/Box'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { SidebarNavigation } from './SidebarNavigation/SidebarNavigation'

import styles from './Sidebar.module.css'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
}

export const Sidebar = ({
  isOpen,
  onClose,
  collapsed,
}: SidebarProps) => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const { data: summary } = useQueueSummary(unitId)
  const { groups } = useSidemenu()

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
      {/* WHY: no desktop a marca mora no header; só a gaveta do celular,
          que cobre o header, precisa repeti-la. */}
      <Box direction="row" className={styles.topBar}>
        <NinoLogo size="sm" tone="light" to={`/${unitId}/visao-geral`} />
      </Box>

      <SidebarNavigation
        groups={groups}
        unitId={unitId}
        isCollapsed={isCollapsed}
        waiting={waiting}
        onNavigate={onClose}
      />

    </Box>
  )
}
