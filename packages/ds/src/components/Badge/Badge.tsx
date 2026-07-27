import { mergeClasses } from '@ds/lib/mergeClasses'

import { BadgeProps, BadgeSize, BadgeVariant } from './Badge.types'

/* Same pale surfaces as Alert: a badge labels a row, it does not raise an
 * alarm, so it never takes the saturated fill the toast uses. */
const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-sand text-body',
  brand: 'bg-brand-soft text-brand-strong',
  success: 'bg-success-surface text-success',
  error: 'bg-danger-surface text-danger',
  warning: 'bg-warning-surface text-warning',
  info: 'bg-cream-deep text-brand-strong',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

const baseBadge = 'inline-flex items-center rounded-card font-semibold'

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
        baseBadge,
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
