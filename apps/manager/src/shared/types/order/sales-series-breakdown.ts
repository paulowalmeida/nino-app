import type { SalesSeriesLine } from './sales-series-line'
import type { SeriesGranularity } from './series-granularity'

export type SalesSeriesBreakdown = {
  granularity: SeriesGranularity
  series: SalesSeriesLine[]
}
