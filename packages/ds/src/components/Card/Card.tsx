import { forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { CardProps, CardVariant } from './Card.types'

const baseCard = 'rounded-card border border-line bg-paper p-4'

/* Variant is height off the page, nothing else: flat sits in the layout,
 * default is lifted a millimetre, elevated is clearly above it. */
const variantClasses: Record<CardVariant, string> = {
  default: 'shadow-card',
  flat: '',
  elevated: 'shadow-card-hover',
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
