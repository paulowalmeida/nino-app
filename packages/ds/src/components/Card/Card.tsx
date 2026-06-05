import { forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { CardProps, CardVariant } from './Card.types'

const baseCard = 'rounded-card bg-white p-4'

const variantClasses: Record<CardVariant, string> = {
  default: 'border border-gray-200 shadow-sm',
  flat: 'border border-gray-200',
  elevated: 'border border-gray-200 shadow-md',
}

/**
 * Surface container for grouping content (dashboards, list items, panels).
 *
 * @param variant - `default` (border + subtle shadow), `flat` (border only),
 * `elevated` (border + larger shadow). Default: `default`
 *
 * @param className - Additional CSS classes
 *
 * @example
 * <Card>content</Card>
 * <Card variant="elevated">highlighted</Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={mergeClasses(baseCard, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
)

Card.displayName = 'Card'
