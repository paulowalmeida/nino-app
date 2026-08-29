import type { CSSProperties } from 'react'
import { NavLink } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import type { IconName } from '@nino/ds/components/Icon'
import { Tooltip } from '@nino/ds/components/Tooltip'
import { SidebarNavLabel } from '@shared/components/SidebarNavLabel/SidebarNavLabel'

import motion from '@styles/motion.module.css'
import styles from './SidebarNavLink.module.css'

type SidebarNavLinkProps = {
  tenantId: string | null
  section: string
  label: string
  icon: IconName
  isCollapsed: boolean
  waiting: number
  delay: CSSProperties
  onNavigate: () => void
}

export const SidebarNavLink = ({
  tenantId,
  section,
  label,
  icon,
  isCollapsed,
  waiting,
  delay,
  onNavigate,
}: SidebarNavLinkProps) => {
  const link = (
    <NavLink
      to={`/${tenantId}/${section}`}
      onClick={onNavigate}
      className={({ isActive }) =>
        isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
      }
    >
      {({ isActive }) => (
        <SidebarNavLabel
          icon={icon}
          label={label}
          size="md"
          isActive={isActive}
          isCollapsed={isCollapsed}
          inactiveColor="text-fg-on-brand/90"
          tally={section === 'pedidos' ? waiting : undefined}
        />
      )}
    </NavLink>
  )

  return (
    <Box style={delay} className={motion.slide}>
      {isCollapsed ? (
        <Tooltip content={label} side="right" delayDuration={0}>
          {link}
        </Tooltip>
      ) : (
        link
      )}
    </Box>
  )
}
