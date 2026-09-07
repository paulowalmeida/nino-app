import { Box } from '@nino/ds/components/Box'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import { SidebarNavLink } from './SidebarNavLink/SidebarNavLink'

import styles from './SidebarNavigation.module.css'

type SidebarNavigationProps = {
  groups: SidemenuItem[]
  tenantId: string | null
  isCollapsed: boolean
  waiting: number
  onNavigate: () => void
}

export const SidebarNavigation = ({
  groups,
  tenantId,
  isCollapsed,
  waiting,
  onNavigate,
}: SidebarNavigationProps) => {
  let staggerIndex = 0

  return (
    <ScrollArea fadeEdges className={styles.navigation}>
      <Box as="nav" direction="column" className={styles.list}>
        {groups.map(({ title, items }) => (
          <Box key={title ?? 'home'} gap={0.5} className={styles.section}>
            {!isCollapsed && title && (
              <Text as="p" className={styles.sectionTitle}>
                {title}
              </Text>
            )}

            {items.map((item) => (
              <SidebarNavLink
                key={item.section}
                tenantId={tenantId}
                section={item.section}
                label={item.label}
                icon={item.icon}
                isCollapsed={isCollapsed}
                waiting={waiting}
                delay={riseDelay(staggerIndex++ * 55 + 120)}
                onNavigate={onNavigate}
              />
            ))}
          </Box>
        ))}
      </Box>
    </ScrollArea>
  )
}
