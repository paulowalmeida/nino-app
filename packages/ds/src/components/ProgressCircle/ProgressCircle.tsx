import { CSSProperties } from 'react'

import { Progress as ArkProgress } from '@ark-ui/react/progress'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { ProgressCircleProps, ProgressCircleSize } from './ProgressCircle.types'

const sizeMap: Record<ProgressCircleSize, { size: string; thickness: string }> = {
  sm: { size: '40px', thickness: '4px' },
  md: { size: '56px', thickness: '5px' },
  lg: { size: '80px', thickness: '7px' },
}

const trackStyle: CSSProperties = {
  stroke: '#e5e7eb',
}

const rangeStyle: CSSProperties = {
  stroke: 'var(--color-brand)',
  strokeLinecap: 'round',
}

/**
 * Circular progress indicator themed via `--color-brand`.
 *
 * @param value - Current value (null for indeterminate)
 *
 * @param min - Minimum value. Default: `0`
 *
 * @param max - Maximum value. Default: `100`
 *
 * @param size - Circle size. Default: `md`
 *
 * @example
 * <ProgressCircle value={75} />
 * <ProgressCircle value={null} size="lg" />
 */
export function ProgressCircle({
  value,
  min = 0,
  max = 100,
  size = 'md',
  className,
}: ProgressCircleProps) {
  const { size: cssSize, thickness } = sizeMap[size]

  const rootStyle = {
    '--size': cssSize,
    '--thickness': thickness,
  } as CSSProperties

  return (
    <ArkProgress.Root
      value={value}
      min={min}
      max={max}
      style={rootStyle}
      className={mergeClasses(className)}
    >
      <ArkProgress.Circle>
        <ArkProgress.CircleTrack style={trackStyle} />
        <ArkProgress.CircleRange
          className="progress-circle-range"
          style={rangeStyle}
        />
      </ArkProgress.Circle>
    </ArkProgress.Root>
  )
}
