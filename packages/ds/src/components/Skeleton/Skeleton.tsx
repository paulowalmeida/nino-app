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

/* Cinza neutro: o placeholder não é conteúdo, e tingir de marca faz a página
 * parecer carregada de laranja antes de existir qualquer dado. */
const animationClasses: Record<SkeletonAnimation, string> = {
  pulse: 'animate-pulse bg-ink/8',
  wave: 'skeleton-wave bg-ink/8',
  none: 'bg-ink/8',
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
