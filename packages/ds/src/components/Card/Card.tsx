import { forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'
import { Slot } from '@ds/lib/Slot'

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
 * @param asChild - Delegates rendering to the direct child via `Slot`,
 * for when the surface itself is the click target
 *
 * @param className - Additional CSS classes
 *
 * @example
 * <Card>content</Card>
 * <Card variant="elevated">highlighted</Card>
 *
 * @example
 * <Card asChild>
 *   <Link to="/pedidos">the whole surface is the link</Link>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', asChild, className, children, ...props }, ref) => {
    const Root = asChild ? Slot : 'div'

    return (
      <Root
        ref={ref}
        className={mergeClasses(baseCard, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </Root>
    )
  }
)

Card.displayName = 'Card'
