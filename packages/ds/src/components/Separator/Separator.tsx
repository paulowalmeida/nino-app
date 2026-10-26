import { HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Separator.module.css'

type SeparatorOrientation = 'horizontal' | 'vertical'

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * `horizontal` (default) or `vertical`. A vertical one needs a height from
   * whoever mounts it — it has none of its own
   */
  orientation?: SeparatorOrientation
  /** Announces the line as a separator instead of hiding it */
  semantic?: boolean
}

const orientationClasses: Record<SeparatorOrientation, string> = {
  horizontal: styles.orientationHorizontal,
  vertical: styles.orientationVertical,
}

/**
 * A line between two blocks.
 *
 * By default it is silent to a screen reader: in a list of twenty rows, a
 * rule announced twenty times is noise, and the separation is already told
 * by the list itself. Turn on `semantic` for the rare line that carries
 * meaning on its own — the divide between two groups of a menu, where
 * nothing else says the group changed.
 *
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" className={styles.tall} />
 * ```
 */
export function Separator({
  orientation = 'horizontal',
  semantic = false,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={semantic ? 'separator' : undefined}
      aria-orientation={semantic ? orientation : undefined}
      aria-hidden={semantic ? undefined : true}
      className={mergeClasses(
        styles.separator,
        orientationClasses[orientation],
        className
      )}
      {...props}
    />
  )
}
