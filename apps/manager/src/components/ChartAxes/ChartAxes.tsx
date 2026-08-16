import { AxisBottom, AxisLeft } from '@visx/axis'
import { scaleLinear, scaleTime } from '@visx/scale'

import type { SeriesGranularity } from '@custom_types/order/series-granularity'
import { chartTickLabel } from '@utils/chart-format'

import styles from './ChartAxes.module.css'

type TimeScale = ReturnType<typeof scaleTime<number>>
type ValueScale = ReturnType<typeof scaleLinear<number>>

export type ChartAxesProps = {
  xScale: TimeScale
  yScale: ValueScale
  innerWidth: number
  innerHeight: number
  isNarrow: boolean
  pointCount: number
  granularity: SeriesGranularity
  yTickFormat: (value: number) => string
}

export const ChartAxes = ({
  xScale,
  yScale,
  innerWidth,
  innerHeight,
  isNarrow,
  pointCount,
  granularity,
  yTickFormat,
}: ChartAxesProps) => (
  <>
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

    <AxisLeft
      scale={yScale}
      numTicks={isNarrow ? 3 : 4}
      hideAxisLine
      hideTicks
      tickFormat={(value) => yTickFormat(Number(value))}
      tickLabelProps={() => ({ className: styles.tickText, dx: -8 })}
    />

    <AxisBottom
      scale={xScale}
      top={innerHeight}
      numTicks={Math.min(pointCount, isNarrow ? 3 : 6)}
      hideTicks
      tickFormat={(value) => chartTickLabel(granularity, value as Date)}
      axisLineClassName={styles.axisLine}
      tickLabelProps={() => ({ className: styles.tickText, dy: 4 })}
    />
  </>
)
