import { mergeClasses } from '@ds/lib/mergeClasses'

import { BadgeProps, BadgeSize, BadgeVariant } from './Badge.types'

/* The badge is a stamped label, not a small toast: the fill carries the state
 * so it survives being read at arm's length, but the form is its own — small
 * caps with wide tracking and a tight 4px corner, the way a ticket is marked,
 * against the 8px surfaces around it. */
const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-body text-cream',
  brand: 'bg-brand text-brand-foreground',
  success: 'bg-success text-cream',
  error: 'bg-danger text-cream',
  warning: 'bg-warning-bright text-ink',
  info: 'bg-warm-light text-ink',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[0.625rem]',
  md: 'px-2 py-0.5 text-[0.6875rem]',
}

const baseBadge =
  'inline-flex items-center rounded-[4px] font-bold uppercase ' +
  'tracking-[0.06em] leading-[1.4]'

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
