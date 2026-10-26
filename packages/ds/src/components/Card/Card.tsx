import { HTMLAttributes, Ref } from 'react'

import { Slot } from '@ds/components/Slot/Slot'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Card.module.css'

type CardVariant = 'default' | 'flat' | 'elevated'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

type CardProps = HTMLAttributes<HTMLDivElement | HTMLButtonElement> & {
  /**
   * `default` (resting shadow), `flat` (border, no shadow), `elevated`
   * (lifted shadow). Default: `default`
   */
  variant?: CardVariant
  /** Respiro interno. Default: `md` */
  padding?: CardPadding
  /**
   * Delegates rendering to the direct child via Radix Slot — for when the
   * click target is something with its own semantics (a `Link`, for a
   * navigation card).
   */
  asChild?: boolean
  ref?: Ref<HTMLDivElement & HTMLButtonElement>
}

const variantClasses: Record<CardVariant, string> = {
  default: styles.elevationResting,
  flat: '',
  elevated: styles.elevationRaised,
}

const paddingClasses: Record<CardPadding, string> = {
  none: styles.paddingNone,
  sm: styles.paddingSmall,
  md: styles.paddingMedium,
  lg: styles.paddingLarge,
}

/**
 * Surface container for grouping content (dashboards, list items, panels).
 *
 * ```tsx
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
 *
 * - `padding` — Respiro interno: `none`, `sm`, `md` (padrão) ou `lg`
 * - `asChild` — Delegates rendering to the direct child via `Slot` — for when the click target has its own semantics (a `Link`)
 * - `onClick` — When set (and `asChild` isn't), the card itself renders as a native `<button>` instead of a `<div>` — the whole surface becomes the click target with no native tag written at the call site
 * - `className` — Additional CSS classes
 * ```
 */
export function Card({
  variant = 'default',
  padding = 'md',
  asChild,
  onClick,
  className,
  children,
  ref,
  ...props
}: CardProps) {
  const isButton = !asChild && !!onClick
  const Root = asChild ? Slot : isButton ? 'button' : 'div'

  return (
    <Root
      ref={ref}
      type={isButton ? 'button' : undefined}
      onClick={onClick}
      className={mergeClasses(
        styles.card,
        paddingClasses[padding],
        variantClasses[variant],
        isButton && styles.clickable,
        className
      )}
      {...props}
    >
      {children}
    </Root>
  )
}
