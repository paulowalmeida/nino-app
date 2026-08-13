import { HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Skeleton.module.css'

type SkeletonVariant = 'rect' | 'circle' | 'text'
type SkeletonAnimation = 'pulse' | 'wave' | 'none'

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant
  animation?: SkeletonAnimation
}

const variantClasses: Record<SkeletonVariant, string> = {
  rect: styles.variantRect,
  circle: styles.variantCircle,
  text: styles.variantText,
}

const animationClasses: Record<SkeletonAnimation, string> = {
  pulse: styles.animationPulse,
  wave: styles.animationWave,
  none: '',
}

/**
 * Grey block standing in for content that has not arrived.
 *
 * It is always silent to a screen reader: what matters is announced by
 * whoever owns the loading state, not by each grey rectangle on the page.
 *
 * @param variant - Shape. `rect` (default), `circle` or `text` — only
 * `text` brings its own size
 *
 * @param animation - `wave` (default) sweeps a shine across, `pulse` fades
 * in place, `none` stays still. All three stop under
 * `prefers-reduced-motion`
 *
 * @param className - Width and height, which `rect` and `circle` do not
 * carry — a skeleton takes the measure of what it replaces
 *
 * @example
 * <Skeleton variant="circle" className="w-10 h-10" />
 * <Skeleton variant="text" animation="wave" />
 * <Skeleton className="w-full h-32" animation="none" />
 */
export function Skeleton({
  variant = 'rect',
  animation = 'wave',
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={mergeClasses(
        styles.skeleton,
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}
