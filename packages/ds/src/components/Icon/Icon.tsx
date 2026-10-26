import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import { TextColor, textColorClasses } from '@ds/lib/textStyles/textStyles'

import spriteUrl from '../../assets/icons.sprite.svg'
import styles from './Icon.module.css'
import { IconName, IconSize } from './Icon.types'

export type { IconName, IconSize }

type IconProps = {
  /** Icon from the DS catalog */
  name: IconName
  /** `xs` to `xl`. Default: `md` */
  size?: IconSize
  /**
   * Entry from the DS text color tokens. Defaults to the surrounding text
   * colour
   */
  color?: TextColor
  /** Announces the icon to screen readers. Omit for decoration */
  label?: string
  /** Additional CSS classes */
  className?: string
}

const sizeClasses: Record<IconSize, string> = {
  xs: styles.sizeExtraSmall,
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
  xl: styles.sizeExtraLarge,
}

/**
 * ```tsx
 * <Icon name="trash" />
 * <Icon name="trash" label="Excluir item" color="danger" />
 * ```
 */
export function Icon({
  name,
  size = 'md',
  color,
  label,
  className,
}: IconProps) {
  return (
    <svg
      className={mergeClasses(
        styles.icon,
        sizeClasses[size],
        color && textColorClasses[color],
        className
      )}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <use href={`${spriteUrl}#${name}`} />
    </svg>
  )
}
