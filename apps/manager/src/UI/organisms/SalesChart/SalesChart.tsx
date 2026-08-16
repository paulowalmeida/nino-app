import { useCallback, useMemo } from 'react'

import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, Bar, LinePath } from '@visx/shape'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import { curveMonotoneX } from '@visx/curve'

import { ChartAxes } from '@molecules/ChartAxes/ChartAxes'
import { ChartTooltip } from '@molecules/ChartTooltip/ChartTooltip'
import { useChartGeometry } from '@hooks/ui/useChartGeometry'
import { useElementWidth } from '@hooks/ui/useElementWidth'
import type { SalesSeriesPoint } from '@custom_types/order/sales-series-point'
import type { SeriesGranularity } from '@custom_types/order/series-granularity'
import { chartCompactNumber } from '@utils/chart-format'
import { nearestIndexByTime, pointerTime } from '@utils/chart-pointer'
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

const STROKE = 2
const DOT_RADIUS = 4

type SalesPoint = { at: Date; value: number }

const formatMetricValue = (value: number, metric: SalesMetric): string =>
  metric === 'revenue' ? brl(value) : String(value)

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

  const { isNarrow, margin, drawHeight, innerWidth, innerHeight } =
    useChartGeometry(width, height)

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
      if (data.length === 0) return

      const time = pointerTime(event, xScale, margin.left)
      if (time === null) return

      const nearestIndex = nearestIndexByTime(data, time)
      const nearest = data[nearestIndex]

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

            <ChartAxes
              xScale={xScale}
              yScale={yScale}
              innerWidth={innerWidth}
              innerHeight={innerHeight}
              isNarrow={isNarrow}
              pointCount={data.length}
              granularity={granularity}
              yTickFormat={(value) =>
                metric === 'revenue'
                  ? chartCompactNumber.format(value)
                  : String(value)
              }
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

            <Bar
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              className={styles.touchArea}
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
            <ChartTooltip
              at={tooltipData.at}
              value={formatMetricValue(tooltipData.value, metric)}
            />
          </TooltipInPortal>
        )}
      </div>
    </figure>
  )
}
