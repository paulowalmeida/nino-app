import { forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { CardProps, CardVariant } from './Card.types'

const baseCard = 'rounded-card border border-line/60 bg-white p-4'

/* A borda fina fecha o cartão em qualquer fundo — sem ela a superfície branca
 * se dissolve na página. A variante diz só a altura: encostado, levantado, ou
 * sem sombra nenhuma. */
const variantClasses: Record<CardVariant, string> = {
  default: 'shadow-card',
  flat: '',
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
