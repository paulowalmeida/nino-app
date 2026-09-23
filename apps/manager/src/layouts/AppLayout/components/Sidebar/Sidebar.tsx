import { useSidemenu } from '@layouts/AppLayout/hooks/useSidemenu/useSidemenu'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
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
  onOpenCommandPalette: () => void
}

export const Sidebar = ({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
  onOpenCommandPalette,
}: SidebarProps) => {
  const user = useSessionStore(({ user }) => user)
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
      <Box direction="row" className={styles.topBar}>
        {isCollapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className={styles.collapseBtn}
            onClick={onToggleCollapse}
            aria-label="Expandir menu"
          >
            <Icon name="menu" size="md" />
          </Button>
        ) : (
          <>
            <NinoLogo size="sm" tone="light" to={`/${unitId}/visao-geral`} />
            <Button
              variant="ghost"
              size="icon"
              className={styles.collapseBtn}
              onClick={onToggleCollapse}
              aria-label="Recolher menu"
            >
              <Icon
                name="chevron-down"
                size="sm"
                className={styles.collapseIcon}
              />
            </Button>
          </>
        )}
      </Box>

      <Box className={styles.searchWrap}>
        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'md'}
          className={styles.searchButton}
          onClick={onOpenCommandPalette}
          aria-label="Buscar funcionalidade"
        >
          <Icon name="search" size="sm" />
          {!isCollapsed && (
            <Text as="span" className={styles.searchLabel}>
              Buscar funcionalidade
            </Text>
          )}
        </Button>
      </Box>

      <Box className={styles.switcherWrap}>
        {/* WHY: the aside never unmounts on mobile — it just slides off
            via CSS. StoreSwitcher's own dropdown keeps its open state
            regardless, so a fresh key on the drawer's own open/close edge
            forces it (and any open popover inside) to reset alongside. */}
        <StoreSwitcher
          key={isOpen ? 'open' : 'closed'}
          currentUnitId={unitId}
          collapsed={isCollapsed}
        />
      </Box>

      <SidebarNavigation
        groups={groups}
        unitId={unitId}
        isCollapsed={isCollapsed}
        waiting={waiting}
        onNavigate={onClose}
      />

      <Box className={styles.footer}>
        <UserMenu
          key={isOpen ? 'open' : 'closed'}
          name={user?.name ?? ''}
          unitId={unitId}
          onNavigate={onClose}
          collapsed={isCollapsed}
        />
      </Box>
    </Box>
  )
}
