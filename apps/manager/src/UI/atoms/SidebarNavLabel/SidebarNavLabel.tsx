import { Icon } from '@nino/ds/components/Icon'
import type { IconName } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import motion from '@styles/motion.module.css'

import styles from './SidebarNavLabel.module.css'

type SidebarNavLabelProps = {
  icon: IconName
  label: string
  size: 'sm' | 'md'
  isActive: boolean
  isCollapsed: boolean
  inactiveColor: string
  tally?: number
}

export const SidebarNavLabel = ({
  icon,
  label,
  size,
  isActive,
  isCollapsed,
  inactiveColor,
  tally,
}: SidebarNavLabelProps) => {
  const labelClassName =
    [!isActive && inactiveColor, isCollapsed && 'sr-only']
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <>
      <Icon name={icon} size={size} />
      <Text
        as="span"
        color={isActive ? 'brand' : undefined}
        className={labelClassName}
      >
        {label}
      </Text>
      {!!tally && (
        <span className={`${motion.pop} ${styles.tally}`}>{tally}</span>
      )}
    </>
  )
}
