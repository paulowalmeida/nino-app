import { HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Badge.module.css'

export type BadgeVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

type BadgeSize = 'sm' | 'md'

const variantClasses: Record<BadgeVariant, string> = {
  default: styles.toneNeutral,
  brand: styles.toneBrand,
  success: styles.toneSuccess,
  error: styles.toneDanger,
  warning: styles.toneWarning,
  info: styles.toneInfo,
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  size?: BadgeSize
}

/**
 * Status badge for labeling items with a visual category.
 *
 * @param variant - Color scheme of the badge. Default: `default`
 *
 * @param size - Size of the badge. Default: `md`
 *
 * @param className - Additional CSS classes
 *
 * @example
 * <Badge variant="success">Ativo</Badge>
 * <Badge variant="error" size="sm">Cancelado</Badge>
 */
export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={mergeClasses(
        styles.badge,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
