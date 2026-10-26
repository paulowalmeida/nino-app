import { HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Stamp.module.css'

type StampSize = 'sm' | 'md' | 'lg'

export type StampTone =
  | 'brand'
  | 'brandSoft'
  | 'brandStrong'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'inverse'

type StampProps = HTMLAttributes<HTMLSpanElement> & {
  /** `sm` (24px), `md` (28px), `lg` (32px). Default: `sm` */
  size?: StampSize
  /** Ink pair of the stamp. Default: `brandSoft` */
  tone?: StampTone
}

const sizeClasses: Record<StampSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

const toneClasses: Record<StampTone, string> = {
  brand: styles.toneBrand,
  brandSoft: styles.toneBrandSoft,
  brandStrong: styles.toneBrandStrong,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  neutral: styles.toneNeutral,
  inverse: styles.toneInverse,
}

/**
 * Square marker holding a centred icon (or a number) — the alert's stamp,
 * the accordion's chevron, the stepper's step.
 *
 * The tone is a closed pair of surface and ink, not two loose props: the
 * caller picks the role, and the contrast comes with it. That is what stops
 * a strong fill from getting light ink on top of it.
 *
 * ```tsx
 * <Stamp tone="danger" size="md">
 *   <Icon name="status-error" size="sm" />
 * </Stamp>
 *
 * - `className` — Additional classes, for when the stamp changes tone along with the parent state (`group-data-[state=open]`, for instance)
 * ```
 */
export function Stamp({
  size = 'sm',
  tone = 'brandSoft',
  className,
  children,
  ...props
}: StampProps) {
  return (
    <span
      className={mergeClasses(
        styles.stamp,
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
