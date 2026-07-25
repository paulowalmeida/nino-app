import { mergeClasses } from '@ds/lib/mergeClasses'

import {
  SkeletonAnimation,
  SkeletonProps,
  SkeletonVariant,
} from './Skeleton.types'

const variantClasses: Record<SkeletonVariant, string> = {
  rect: 'rounded-md',
  circle: 'rounded-full',
  text: 'rounded w-full h-4',
}

const animationClasses: Record<SkeletonAnimation, string> = {
  pulse: 'animate-pulse bg-gray-200',
  wave: 'skeleton-wave bg-gray-200',
  none: 'bg-gray-200',
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
