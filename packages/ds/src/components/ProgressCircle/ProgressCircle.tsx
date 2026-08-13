import { CSSProperties } from 'react'

import { Progress as ArkProgress } from '@ark-ui/react/progress'

import styles from './ProgressCircle.module.css'

type ProgressCircleSize = 'sm' | 'md' | 'lg'

type ProgressCircleProps = {
  value: number | null
  min?: number
  max?: number
  size?: ProgressCircleSize
  label?: string
  className?: string
}

const sizeMap: Record<ProgressCircleSize, { size: string; thickness: string }> =
  {
    sm: { size: '40px', thickness: '4px' },
    md: { size: '56px', thickness: '5px' },
    lg: { size: '80px', thickness: '7px' },
  }

/**
 * Progress drawn as a ring — for what fills up in place, where a bar would
 * take a whole line: an upload inside a card, a quota on a dashboard.
 *
 * @param value - How far along. `null` means the length is unknown, and the
 * ring spins instead of filling
 *
 * @param min - Where the ring starts. Default: `0`
 *
 * @param max - Where it is full. Default: `100`
 *
 * @param size - `sm` (40px), `md` (56px) or `lg` (80px). Default: `md`
 *
 * @param label - What a screen reader announces. Without it the ring is
 * read as a bare number, with no clue of what is progressing
 *
 * @example
 * <ProgressCircle value={uploaded} label="Enviando a foto" />
 * <ProgressCircle value={null} label="Carregando" size="lg" />
 */
export function ProgressCircle({
  value,
  min = 0,
  max = 100,
  size = 'md',
  label,
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
      aria-label={label}
      style={rootStyle}
      className={className}
    >
      <ArkProgress.Circle>
        <ArkProgress.CircleTrack className={styles.ring} />
        <ArkProgress.CircleRange className={styles.arc} />
      </ArkProgress.Circle>
    </ArkProgress.Root>
  )
}
