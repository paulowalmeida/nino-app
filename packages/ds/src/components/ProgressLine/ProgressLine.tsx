import { Progress as ArkProgress } from '@ark-ui/react/progress'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './ProgressLine.module.css'

type ProgressLineSize = 'sm' | 'md' | 'lg'

type ProgressLineProps = {
  /**
   * How far along. `null` means the length is unknown, and a short stretch
   * travels the bar instead of filling it
   */
  value: number | null
  /** Where the bar starts. Default: `0` */
  min?: number
  /** Where it is full. Default: `100` */
  max?: number
  /** Thickness. Default: `md` */
  size?: ProgressLineSize
  /**
   * What a screen reader announces. Without it the bar is read as a bare
   * number, with no clue of what is progressing
   */
  label?: string
  className?: string
}

const trackSizeClasses: Record<ProgressLineSize, string> = {
  sm: styles.trackSizeSmall,
  md: styles.trackSizeMedium,
  lg: styles.trackSizeLarge,
}

/**
 * Progress drawn as a bar — for what fills across a width: a step out of
 * many, a file being sent, a goal for the day.
 *
 * ```tsx
 * <ProgressLine value={60} label="Cadastro" />
 * <ProgressLine value={null} label="Enviando" size="sm" />
 * ```
 */
export function ProgressLine({
  value,
  min = 0,
  max = 100,
  size = 'md',
  label,
  className,
}: ProgressLineProps) {
  return (
    <ArkProgress.Root
      value={value}
      min={min}
      max={max}
      aria-label={label}
      className={mergeClasses(styles.progressLine, className)}
    >
      <ArkProgress.Track
        className={mergeClasses(styles.track, trackSizeClasses[size])}
      >
        <ArkProgress.Range className={styles.fill} />
      </ArkProgress.Track>
    </ArkProgress.Root>
  )
}
