import type { CSSProperties } from 'react'
import { NavLink } from 'react-router'

import { Accordion } from '@nino/ds/components/Accordion'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { NavItem } from '@custom_types/ui/nav-item'

import motion from '@styles/motion.module.css'

import styles from './SidebarNavItem.module.css'

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
  const labelClassName = (isActive: boolean, inactiveColor: string) =>
    [!isActive && inactiveColor, isCollapsed && 'sr-only']
      .filter(Boolean)
      .join(' ') || undefined

  const iconAndLabel = (isActive: boolean) => (
    <>
      <Icon name={icon} size="md" />
      <Text
        as="span"
        color={isActive ? 'brand' : undefined}
        className={labelClassName(isActive, 'text-fg-on-brand/45')}
      >
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
          {({ isActive }) => iconAndLabel(isActive)}
        </NavLink>
      </Flexbox>
    )
  }

  const isGroupActive = isInside && isOpen

  return (
    <Flexbox style={delay} className={motion.slide}>
      <Accordion
        items={[
          {
            value: section,
            trigger: (
              <Flexbox direction="row" className={styles.navGroupHeaderRow}>
                {iconAndLabel(isGroupActive)}
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
                    {({ isActive }) => (
                      <>
                        <Icon name={childIcon} size="sm" />
                        <Text
                          as="span"
                          color={isActive ? 'brand' : undefined}
                          className={labelClassName(
                            isActive,
                            'text-fg-on-brand/40'
                          )}
                        >
                          {childLabel}
                        </Text>
                      </>
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
