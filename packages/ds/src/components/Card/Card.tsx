import { forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { CardProps, CardVariant } from './Card.types'

const baseCard = 'rounded-card bg-white p-4'

/* Height off the page, and only one thing says it: a lifted surface carries
 * shadow, a resting one carries the border. Both at once is the stacked look
 * the toast dropped. */
const variantClasses: Record<CardVariant, string> = {
  default: 'shadow-card',
  flat: 'border border-line',
  elevated: 'shadow-card-hover',
}

/**
 * Surface container for grouping content (dashboards, list items, panels).
 *
 * @param variant - `default` (resting shadow), `flat` (border, no shadow),
 * `elevated` (lifted shadow). Default: `default`
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
