import { Box } from '@nino/ds/components/Box'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import { SidebarNavGroup } from './SidebarNavGroup/SidebarNavGroup'
import { SidebarNavLink } from './SidebarNavLink/SidebarNavLink'

import styles from './SidebarNavigation.module.css'

type SidebarNavigationProps = {
  groups: SidemenuItem[]
  tenantId: string | null
  isCollapsed: boolean
  waiting: number
  openSection: string | null
  onOpenSectionChange: (section: string | null) => void
  isInside: (section: string) => boolean
  onNavigate: () => void
  onExpand: () => void
}

export const SidebarNavigation = ({
  groups,
  tenantId,
  isCollapsed,
  waiting,
  openSection,
  onOpenSectionChange,
  isInside,
  onNavigate,
  onExpand,
}: SidebarNavigationProps) => {
  let staggerIndex = 0

  return (
    <ScrollArea fadeEdges className={styles.navigation}>
      <Box as="nav" direction="column" className={styles.list}>
        {groups.map(({ title, items }) => (
          <Box key={title} gap={0.5} className={styles.section}>
            {!isCollapsed && (
              <Text as="p" className={styles.sectionTitle}>
                {title}
              </Text>
            )}

            {items.map((item) =>
              item.children ? (
                <SidebarNavGroup
                  key={item.section}
                  tenantId={tenantId}
                  section={item.section}
                  label={item.label}
                  icon={item.icon}
                  items={item.children}
                  isCollapsed={isCollapsed}
                  isInside={isInside(item.section)}
                  isOpen={openSection === item.section}
                  onOpenChange={(open) => {
                    if (open && isCollapsed) onExpand()
                    onOpenSectionChange(open ? item.section : null)
                  }}
                  delay={riseDelay(staggerIndex++ * 55 + 120)}
                  onNavigate={onNavigate}
                />
              ) : (
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
              )
            )}
          </Box>
        ))}
      </Box>
    </ScrollArea>
  )
}
