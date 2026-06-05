import { mergeClasses } from '@ds/lib/mergeClasses'

import { BadgeProps, BadgeSize, BadgeVariant } from './Badge.types'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  brand: 'bg-brand-soft text-brand-strong',
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

const baseBadge = 'inline-flex items-center rounded-full font-medium'

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
