import { Progress as ArkProgress } from '@ark-ui/react/progress'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { ProgressLineProps, ProgressLineSize } from './ProgressLine.types'

const trackSizeClasses: Record<ProgressLineSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const baseTrack = 'w-full overflow-hidden rounded-full bg-gray-200'
const baseRange = 'h-full rounded-full bg-brand transition-all duration-300'

/**
 * Linear progress bar themed via `--color-brand`.
 *
 * @param value - Current value (null for indeterminate)
 *
 * @param min - Minimum value. Default: `0`
 *
 * @param max - Maximum value. Default: `100`
 *
 * @param size - Bar thickness. Default: `md`
 *
 * @example
 * <ProgressLine value={60} />
 * <ProgressLine value={null} size="sm" />
 */
export function ProgressLine({
  value,
  min = 0,
  max = 100,
  size = 'md',
  className,
}: ProgressLineProps) {
  return (
    <ArkProgress.Root
      value={value}
      min={min}
      max={max}
      className={mergeClasses('w-full', className)}
    >
      <ArkProgress.Track
        className={mergeClasses(baseTrack, trackSizeClasses[size])}
      >
        <ArkProgress.Range className={baseRange} />
      </ArkProgress.Track>
    </ArkProgress.Root>
  )
}
