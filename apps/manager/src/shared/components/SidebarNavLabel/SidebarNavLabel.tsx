import type { IconName } from '@nino/ds/components/Icon'
import { Icon } from '@nino/ds/components/Icon'
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
      <span className={styles.iconSlot}>
        <Icon name={icon} size={size} />
        {!!tally && (
          <Text
            as="span"
            className={`${motion.pop} ${styles.tally}`}
            aria-label={`${tally} aguardando`}
          >
            {tally > 99 ? '99+' : tally}
          </Text>
        )}
      </span>
      <Text
        as="span"
        size="sm"
        color={isActive ? 'brand' : undefined}
        className={labelClassName}
      >
        {label}
      </Text>
    </>
  )
}
