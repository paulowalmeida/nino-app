import type { CSSProperties } from 'react'
import { NavLink } from 'react-router'

import { Accordion } from '@nino/ds/components/Accordion'
import { Icon } from '@nino/ds/components/Icon'
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
      <Icon name={icon} className={styles.navIcon} />
      {!isCollapsed && <span>{label}</span>}
      {section === 'pedidos' && waiting > 0 && (
        <span className={`${motion.pop} ${styles.tally}`}>{waiting}</span>
      )}
    </>
  )

  if (!children) {
    return (
      <div style={delay} className={motion.slide}>
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
      </div>
    )
  }

  return (
    <div style={delay} className={motion.slide}>
      <Accordion
        items={[
          {
            value: section,
            trigger: (
              <span className={styles.triggerContent}>{content}</span>
            ),
            content: (
              <div className={styles.subNav}>
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
                    <Icon name={childIcon} className={styles.subIcon} />
                    {!isCollapsed && <span>{childLabel}</span>}
                  </NavLink>
                ))}
              </div>
            ),
          },
        ]}
        value={isOpen ? [section] : []}
        onValueChange={(values) => onOpenChange(values.includes(section))}
        className={styles.accordionRoot}
        itemClassName={styles.accordionItem}
        triggerClassName={
          isInside && isOpen
            ? `${styles.navItemTrigger} ${styles.navItemActive}`
            : styles.navItemTrigger
        }
        contentClassName={styles.accordionContent}
      />
    </div>
  )
}
