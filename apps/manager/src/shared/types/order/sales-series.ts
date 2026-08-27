import type { SalesSeriesPoint } from './sales-series-point'
import type { SeriesGranularity } from './series-granularity'

export type SalesSeries = {
  granularity: SeriesGranularity
  points: SalesSeriesPoint[]
}
