import { useCallback, useMemo } from 'react'

import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { Bar, LinePath } from '@visx/shape'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import { curveMonotoneX } from '@visx/curve'

import { ChartAxes } from '@molecules/ChartAxes/ChartAxes'
import { ChartLegend } from '@molecules/ChartLegend/ChartLegend'
import {
  ChartSeriesTooltip,
} from '@molecules/ChartSeriesTooltip/ChartSeriesTooltip'
import { CHART_PALETTE } from '@constants/order.constants'
import { useChartGeometry } from '@hooks/ui/useChartGeometry'
import { useElementWidth } from '@hooks/ui/useElementWidth'
import type { SalesSeriesLine } from '@custom_types/order/sales-series-line'
import type { SeriesGranularity } from '@custom_types/order/series-granularity'
import { chartCompactNumber } from '@utils/chart-format'
import { nearestIndexByTime, pointerTime } from '@utils/chart-pointer'
import { brl } from '@utils/money'

import styles from './SalesMultiChart.module.css'

export type SalesMultiChartProps = {
  series: SalesSeriesLine[]
  granularity: SeriesGranularity
  labelOf: (key: string) => string
  height?: number
  label: string
}

const STROKE = 2
const DOT_RADIUS = 3.5

type ChartPoint = { at: Date; value: number }
type ChartLine = { key: string; colorClass: string; points: ChartPoint[] }
type TooltipData = { at: Date; lines: { key: string; value: number }[] }

const toChartLines = (series: SalesSeriesLine[]): ChartLine[] =>
  series.map((line, index) => ({
    key: line.key,
    colorClass: styles[CHART_PALETTE[index % CHART_PALETTE.length]],
    points: line.points.map((point) => ({
      at: new Date(point.at),
      value: point.revenue,
    })),
  }))

export const SalesMultiChart = ({
  series,
  granularity,
  labelOf,
  height = 240,
  label,
}: SalesMultiChartProps) => {
  const { ref: holder, width } = useElementWidth<HTMLElement>()

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<TooltipData>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const lines = useMemo(() => toChartLines(series), [series])
  const timeline = useMemo(() => lines[0]?.points ?? [], [lines])

  const { isNarrow, margin, drawHeight, innerWidth, innerHeight } =
    useChartGeometry(width, height)

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [
          timeline[0]?.at ?? new Date(),
          timeline[timeline.length - 1]?.at ?? new Date(),
        ],
        range: [0, innerWidth],
      }),
    [timeline, innerWidth]
  )

  const maxValue = useMemo(
    () =>
      Math.max(
        ...lines.flatMap((line) => line.points.map((point) => point.value)),
        1
      ),
    [lines]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, maxValue * 1.1],
        range: [innerHeight, 0],
        nice: true,
      }),
    [maxValue, innerHeight]
  )

  const handleMove = useCallback(
    (event: React.PointerEvent) => {
      if (timeline.length === 0) return

      const time = pointerTime(event, xScale, margin.left)
      if (time === null) return

      const nearestIndex = nearestIndexByTime(timeline, time)
      const nearest = timeline[nearestIndex]

      showTooltip({
        tooltipData: {
          at: nearest.at,
          lines: lines.map((line) => ({
            key: line.key,
            value: line.points[nearestIndex]?.value ?? 0,
          })),
        },
        tooltipLeft: margin.left + (xScale(nearest.at) ?? 0),
        tooltipTop: margin.top,
      })
    },
    [timeline, lines, xScale, showTooltip, margin]
  )

  if (timeline.length < 2) return null

  return (
    <figure className={styles.figure} ref={holder}>
      <div ref={containerRef} className={styles.canvas}>
        <svg width={width} height={drawHeight} role="img" aria-label={label}>
          <Group left={margin.left} top={margin.top}>
            {lines.map((line) => (
              <LinePath<ChartPoint>
                key={line.key}
                data={line.points}
                x={(point) => xScale(point.at) ?? 0}
                y={(point) => yScale(point.value) ?? 0}
                curve={curveMonotoneX}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={line.colorClass}
              />
            ))}

            {lines.map((line) =>
              line.points.map((point) => (
                <circle
                  key={`${line.key}-${point.at.toISOString()}`}
                  cx={xScale(point.at)}
                  cy={yScale(point.value)}
                  r={DOT_RADIUS}
                  strokeWidth={2}
                  className={`${styles.dot} ${line.colorClass}`}
                />
              ))
            )}

            <ChartAxes
              xScale={xScale}
              yScale={yScale}
              innerWidth={innerWidth}
              innerHeight={innerHeight}
              isNarrow={isNarrow}
              pointCount={timeline.length}
              granularity={granularity}
              yTickFormat={(value) => chartCompactNumber.format(value)}
            />

            {tooltipOpen && tooltipData && (
              <line
                x1={xScale(tooltipData.at)}
                x2={xScale(tooltipData.at)}
                y1={0}
                y2={innerHeight}
                className={styles.cursor}
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
            <ChartSeriesTooltip
              at={tooltipData.at}
              lines={tooltipData.lines.map((line) => ({
                key: line.key,
                label: labelOf(line.key),
                value: brl(line.value),
              }))}
            />
          </TooltipInPortal>
        )}
      </div>

      <ChartLegend
        items={lines.map((line) => ({
          key: line.key,
          label: labelOf(line.key),
        }))}
      />
    </figure>
  )
}
