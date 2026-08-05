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

/* Só entra quando o próprio Card é o alvo do clique — texto à esquerda
 * (botão centraliza por padrão), largura cheia (botão encolhe pro
 * conteúdo), e o afago de foco/hover que uma `<div>` nunca precisou ter. */
const interactiveCard =
  'w-full cursor-pointer text-left transition-shadow duration-150 ' +
  'hover:shadow-card-hover focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'

/**
 * Surface container for grouping content (dashboards, list items, panels).
 *
 * @param variant - `default` (resting shadow), `flat` (border, no shadow),
 * `elevated` (lifted shadow). Default: `default`
 *
 * @param asChild - Delegates rendering to the direct child via `Slot` — for
 * when the click target has its own semantics (a `Link`)
 *
 * @param onClick - When set (and `asChild` isn't), the card itself renders
 * as a native `<button>` instead of a `<div>` — the whole surface becomes
 * the click target with no native tag written at the call site
 *
 * @param className - Additional CSS classes
 *
 * @example
 * <Card>content</Card>
 * <Card variant="elevated">highlighted</Card>
 *
 * @example
 * <Card onClick={() => onPick(item)}>the whole surface is the button</Card>
 *
 * @example
 * <Card asChild>
 *   <Link to="/pedidos">the whole surface is the link</Link>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement & HTMLButtonElement, CardProps>(
  ({ variant = 'default', asChild, onClick, className, children, ...props }, ref) => {
    const isButton = !asChild && !!onClick
    const Root = asChild ? Slot : isButton ? 'button' : 'div'

    return (
      <Root
        ref={ref}
        type={isButton ? 'button' : undefined}
        onClick={onClick}
        className={mergeClasses(
          baseCard,
          variantClasses[variant],
          isButton && interactiveCard,
          className
        )}
        {...props}
      >
        {children}
      </Root>
    )
  }
)

Card.displayName = 'Card'
