import type { CSSProperties } from 'react'
import { NavLink } from 'react-router'

import { Accordion } from '@nino/ds/components/Accordion'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { NavItem } from '@custom_types/ui/nav-item'

import motion from '@styles/motion.module.css'
import styles from '@compositions/Sidebar/Sidebar.module.css'

type SidebarNavItemProps = {
  tenantId: string | null
  item: NavItem
  isCollapsed: boolean
  isInside: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  delay: CSSProperties
  waiting: number
  onNavigate: () => void
}

export const SidebarNavItem = ({
  tenantId,
  item: { section, label, icon, children },
  isCollapsed,
  isInside,
  isOpen,
  onOpenChange,
  delay,
  waiting,
  onNavigate,
}: SidebarNavItemProps) => {
  const content = (
    <>
      <Icon name={icon} size="md" />
      <Text as="span" className={isCollapsed ? 'sr-only' : undefined}>
        {label}
      </Text>
      {section === 'pedidos' && waiting > 0 && (
        <span className={`${motion.pop} ${styles.tally}`}>{waiting}</span>
      )}
    </>
  )

  if (!children) {
    return (
      <Flexbox style={delay} className={motion.slide}>
        <NavLink
          to={`/${tenantId}/${section}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            isActive
              ? `${styles.navItem} ${styles.navItemActive}`
              : styles.navItem
          }
        >
          {content}
        </NavLink>
      </Flexbox>
    )
  }

  return (
    <Flexbox style={delay} className={motion.slide}>
      <Accordion
        items={[
          {
            value: section,
            trigger: (
              <Flexbox direction="row" className={styles.navGroupToggleRow}>
                {content}
              </Flexbox>
            ),
            content: (
              <Flexbox direction="column" className={styles.subNav}>
                {children.map(({ to, label: childLabel, icon: childIcon }) => (
                  <NavLink
                    key={to}
                    to={`/${tenantId}/${section}/${to}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.subItem} ${styles.subItemActive}`
                        : styles.subItem
                    }
                  >
                    <Icon name={childIcon} size="sm" />
                    <Text
                      as="span"
                      className={isCollapsed ? 'sr-only' : undefined}
                    >
                      {childLabel}
                    </Text>
                  </NavLink>
                ))}
              </Flexbox>
            ),
          },
        ]}
        value={isOpen ? [section] : []}
        onValueChange={(values) => onOpenChange(values.includes(section))}
        className={styles.navGroup}
        itemClassName={styles.navGroupItem}
        triggerClassName={
          isInside && isOpen
            ? `${styles.navGroupToggle} ${styles.navItemActive}`
            : styles.navGroupToggle
        }
        contentClassName={styles.navGroupPanel}
      />
    </Flexbox>
  )
}
