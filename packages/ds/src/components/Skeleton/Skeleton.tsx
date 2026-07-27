import { mergeClasses } from '@ds/lib/mergeClasses'

import {
  SkeletonAnimation,
  SkeletonProps,
  SkeletonVariant,
} from './Skeleton.types'

const variantClasses: Record<SkeletonVariant, string> = {
  rect: 'rounded-card',
  circle: 'rounded-full',
  text: 'rounded-[4px] w-full h-4',
}

/* Sand, not gray: the placeholder has to read as the warm surface it will be
 * replaced by, otherwise the page turns cold while it loads. */
const animationClasses: Record<SkeletonAnimation, string> = {
  pulse: 'animate-pulse bg-sand',
  wave: 'skeleton-wave bg-sand',
  none: 'bg-sand',
}

/**
 * Visual placeholder shown while content is loading.
 *
 * @param variant - Shape of the skeleton. Default: `rect`
 *
 * @param animation - Animation type. Default: `wave`
 *
 * @param className - Additional classes (width and height required for rect/circle)
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
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}
