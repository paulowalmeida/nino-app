import type { CSSProperties } from 'react'
import { NavLink } from 'react-router'

import { Accordion } from '@nino/ds/components/Accordion'
import { Flexbox } from '@nino/ds/components/Flexbox'
import type { IconName } from '@nino/ds/components/Icon'
import { SidebarNavLabel } from '@atoms/SidebarNavLabel/SidebarNavLabel'

import motion from '@styles/motion.module.css'

import styles from './SidebarNavGroup.module.css'

type SidebarNavGroupItem = { to: string; label: string; icon: IconName }

type SidebarNavGroupProps = {
  tenantId: string | null
  section: string
  label: string
  icon: IconName
  items: SidebarNavGroupItem[]
  isCollapsed: boolean
  isInside: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  delay: CSSProperties
  onNavigate: () => void
}

export const SidebarNavGroup = ({
  tenantId,
  section,
  label,
  icon,
  items,
  isCollapsed,
  isInside,
  isOpen,
  onOpenChange,
  delay,
  onNavigate,
}: SidebarNavGroupProps) => {
  const isGroupActive = isInside && isOpen

  return (
    <Flexbox style={delay} className={motion.slide}>
      <Accordion
        items={[
          {
            value: section,
            trigger: (
              <Flexbox direction="row" className={styles.navGroupHeaderRow}>
                <SidebarNavLabel
                  icon={icon}
                  label={label}
                  size="md"
                  isActive={isGroupActive}
                  isCollapsed={isCollapsed}
                  inactiveColor="text-fg-on-brand/45"
                />
              </Flexbox>
            ),
            content: (
              <Flexbox direction="column" className={styles.subNav}>
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={`/${tenantId}/${section}/${item.to}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.subItem} ${styles.subItemActive}`
                        : styles.subItem
                    }
                  >
                    {({ isActive }) => (
                      <SidebarNavLabel
                        icon={item.icon}
                        label={item.label}
                        size="sm"
                        isActive={isActive}
                        isCollapsed={isCollapsed}
                        inactiveColor="text-fg-on-brand/40"
                      />
                    )}
                  </NavLink>
                ))}
              </Flexbox>
            ),
          },
        ]}
        value={isOpen ? [section] : []}
        onValueChange={(values) => onOpenChange(values.includes(section))}
        className={styles.navGroup}
        itemClassName={styles.navGroupWrapper}
        triggerClassName={
          isGroupActive
            ? `${styles.navGroupToggle} ${styles.navItemActive}`
            : styles.navGroupToggle
        }
        contentClassName={styles.navGroupPanel}
      />
    </Flexbox>
  )
}
