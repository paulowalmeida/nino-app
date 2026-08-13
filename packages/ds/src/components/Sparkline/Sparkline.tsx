import { SVGAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Sparkline.module.css'

/* `values` is dropped from the SVG props on purpose: the native attribute
 * exists for animation (`<animate values="...">`) and is a string, which
 * would clash with the numeric series. */
type SparklineProps = Omit<
  SVGAttributes<SVGSVGElement>,
  'children' | 'values'
> & {
  values: number[]
  label: string
  height?: number
  showLastPoint?: boolean
}

const VIEW_WIDTH = 100
const STROKE = 2
/* Room above and below so the dot is not clipped at the edge. */
const PADDING = 4

/** Flattens the series onto the drawing space. A flat series sits mid-way. */
const toPoints = (values: number[], height: number): [number, number][] => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min
  const usable = height - PADDING * 2
  const step = VIEW_WIDTH / (values.length - 1)

  return values.map((value, index) => [
    index * step,
    span === 0 ? height / 2 : PADDING + (1 - (value - min) / span) * usable,
  ])
}

/**
 * Trend line with no axes, made to sit beside a number — it is not a chart
 * to read values off, it is the shape of the series. The exact figure lives
 * in the number it accompanies.
 *
 * The line inherits `currentColor`, so the caller picks the tone with a text
 * class and the drawing follows the state of the block around it — no colour
 * prop involved.
 *
 * @param values - The series, in time order. Fewer than two points draws
 * nothing at all
 *
 * @param label - What the line shows, for whoever cannot see it. Without it
 * the chart is invisible to a screen reader
 *
 * @param height - Height in px; the width follows the container.
 * Default: `32`
 *
 * @param showLastPoint - Marks where the series ends with a dot.
 * Default: `true`
 *
 * @example
 * <Sparkline values={[3, 8, 5, 12]} label="Faturamento nos últimos 7 dias" />
 */
export function Sparkline({
  values,
  label,
  height = 32,
  showLastPoint = true,
  className,
  ...props
}: SparklineProps) {
  if (values.length < 2) return null

  const points = toPoints(values, height)
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `${line} ${VIEW_WIDTH},${height} 0,${height}`
  const [, lastY] = points[points.length - 1]

  return (
    <span className={mergeClasses(styles.sparkline, className)} style={{ height }}>
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        preserveAspectRatio="none"
        height={height}
        className={styles.chart}
        {...props}
      >
        <polygon points={area} fill="currentColor" opacity={0.1} />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {showLastPoint && (
        <span
          aria-hidden="true"
          className={styles.lastPointDot}
          style={{ left: '100%', top: `${(lastY / height) * 100}%` }}
        />
      )}
    </span>
  )
}
