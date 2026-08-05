import { useCallback, useMemo } from 'react'

import { AxisBottom, AxisLeft } from '@visx/axis'
import { localPoint } from '@visx/event'
import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, Bar, LinePath } from '@visx/shape'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import { curveMonotoneX } from '@visx/curve'

import { useElementWidth } from '@hooks/ui/useElementWidth'
import type { SalesSeriesPoint } from '@custom_types/order/sales-series-point'
import type { SeriesGranularity } from '@custom_types/order/series-granularity'
import { brl } from '@utils/money'

import styles from './SalesChart.module.css'

/** What the line measures — changes the axis and the value format. */
export type SalesMetric = 'revenue' | 'orderCount'

export type SalesChartProps = {
  points: SalesSeriesPoint[]
  granularity: SeriesGranularity
  metric?: SalesMetric
  /** Drawing height in px. */
  height?: number
  /** Accessible name — the chart is an image to anyone who can't see it. */
  label: string
}

/*
 * Room for the axes to breathe, in two sizes: on mobile the Y-axis label is
 * shorter and the wide margin would eat into the drawing area.
 */
const MARGIN = { top: 12, right: 20, bottom: 32, left: 52 }
/* The right side holds the last axis label: at 8px, the final date was
   getting cut off at the card's edge. */
const NARROW_MARGIN = { top: 8, right: 20, bottom: 28, left: 38 }

/* Below this the chart is narrow: fewer axis marks and a smaller margin. */
const NARROW_WIDTH = 420

const STROKE = 2
const DOT_RADIUS = 4

const hourLabel = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const dayLabel = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

const fullLabel = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const compact = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

type SalesPoint = { at: Date; value: number }

const formatMetricValue = (value: number, metric: SalesMetric): string =>
  metric === 'revenue' ? brl(value) : String(value)

/**
 * Sales evolution over the period: closed area with a line on top, a single
 * series.
 *
 * No legend on purpose — a single series is named by the block's title, and
 * a box with a little square would repeat what's already written above it.
 *
 * The area exists to give the line body without inventing a second color; it
 * stays in a faint gradient so it doesn't compete with the stroke, which is
 * what actually gets read.
 */
export const SalesChart = ({
  points,
  granularity,
  metric = 'revenue',
  height = 240,
  label,
}: SalesChartProps) => {
  const { ref: holder, width } = useElementWidth<HTMLElement>()

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<SalesPoint>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const data = useMemo<SalesPoint[]>(
    () =>
      points.map((point) => ({
        at: new Date(point.at),
        value: metric === 'revenue' ? point.revenue : point.orderCount,
      })),
    [points, metric]
  )

  const isNarrow = width > 0 && width < NARROW_WIDTH
  const margin = isNarrow ? NARROW_MARGIN : MARGIN
  const drawHeight = isNarrow ? Math.min(height, 180) : height

  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(drawHeight - margin.top - margin.bottom, 0)

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [
          data[0]?.at ?? new Date(),
          data[data.length - 1]?.at ?? new Date(),
        ],
        range: [0, innerWidth],
      }),
    [data, innerWidth]
  )

  /* The axis starts at zero even when the series never gets close to it:
     starting from the minimum would make a cents-sized swing look like a
     jump. */
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...data.map((point) => point.value), 1) * 1.1],
        range: [innerHeight, 0],
        nice: true,
      }),
    [data, innerHeight]
  )

  const handleMove = useCallback(
    (event: React.PointerEvent) => {
      const point = localPoint(event)
      if (!point || data.length === 0) return

      const x = point.x - margin.left
      const time = xScale.invert(x).getTime()

      const nearest = data.reduce((best, current) =>
        Math.abs(current.at.getTime() - time) <
        Math.abs(best.at.getTime() - time)
          ? current
          : best
      )

      showTooltip({
        tooltipData: nearest,
        tooltipLeft: margin.left + (xScale(nearest.at) ?? 0),
        tooltipTop: margin.top + (yScale(nearest.value) ?? 0),
      })
    },
    [data, xScale, yScale, showTooltip, margin]
  )

  if (data.length < 2) return null

  return (
    <figure className={styles.figure} ref={holder}>
      <div ref={containerRef} className={styles.canvas}>
        <svg width={width} height={drawHeight} role="img" aria-label={label}>
          <defs>
            <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className={styles.areaTop} />
              <stop offset="100%" className={styles.areaBottom} />
            </linearGradient>
          </defs>

          <Group left={margin.left} top={margin.top}>
            {yScale.ticks(isNarrow ? 3 : 4).map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={innerWidth}
                y1={yScale(tick)}
                y2={yScale(tick)}
                className={styles.grid}
              />
            ))}

            <AreaClosed<SalesPoint>
              data={data}
              x={(point) => xScale(point.at) ?? 0}
              y={(point) => yScale(point.value) ?? 0}
              yScale={yScale}
              curve={curveMonotoneX}
              fill="url(#salesArea)"
            />

            <LinePath<SalesPoint>
              data={data}
              x={(point) => xScale(point.at) ?? 0}
              y={(point) => yScale(point.value) ?? 0}
              curve={curveMonotoneX}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.line}
            />

            {data.map((point) => (
              <circle
                key={point.at.toISOString()}
                cx={xScale(point.at)}
                cy={yScale(point.value)}
                r={DOT_RADIUS}
                strokeWidth={2}
                className={styles.dot}
              />
            ))}

            <AxisLeft
              scale={yScale}
              numTicks={isNarrow ? 3 : 4}
              hideAxisLine
              hideTicks
              tickFormat={(value) =>
                metric === 'revenue'
                  ? compact.format(Number(value))
                  : String(value)
              }
              tickLabelProps={() => ({ className: styles.tickText, dx: -8 })}
            />

            <AxisBottom
              scale={xScale}
              top={innerHeight}
              numTicks={Math.min(data.length, isNarrow ? 3 : 6)}
              hideTicks
              tickFormat={(value) =>
                (granularity === 'hour' ? hourLabel : dayLabel).format(
                  value as Date
                )
              }
              axisLineClassName={styles.axisLine}
              tickLabelProps={() => ({ className: styles.tickText, dy: 4 })}
            />

            {tooltipOpen && tooltipData && (
              <circle
                cx={xScale(tooltipData.at)}
                cy={yScale(tooltipData.value)}
                r={DOT_RADIUS + 2}
                strokeWidth={2}
                className={styles.dotActive}
              />
            )}

            {/* Mouse target over the whole area: aiming at the exact point
                would need precision nobody has on a phone. */}
            <Bar
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              className={styles.touchArea}
              /*
               * Pointer, not separate mouse+touch: a plain tap doesn't fire
               * `touchmove`, so listening only to movement left the phone
               * unresponsive. `pointerdown` covers touch, click and pen with
               * a single path.
               *
               * Leaving doesn't hide on touch — the finger lifts right after,
               * and the info would disappear before it could be read.
               */
              onPointerDown={handleMove}
              onPointerMove={handleMove}
              onPointerLeave={(event) =>
                event.pointerType === 'mouse' && hideTooltip()
              }
            />
          </Group>
        </svg>

        {tooltipOpen && tooltipData && (
          <TooltipInPortal
            left={tooltipLeft}
            top={tooltipTop}
            className={styles.tooltip}
          >
            <p className={styles.tooltipLabel}>
              {fullLabel.format(tooltipData.at)}
            </p>
            <p className={styles.tooltipValue}>
              {formatMetricValue(tooltipData.value, metric)}
            </p>
          </TooltipInPortal>
        )}
      </div>
    </figure>
  )
}
