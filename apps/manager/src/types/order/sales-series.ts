import type { SalesSeriesPoint } from './sales-series-point'
import type { SeriesGranularity } from './series-granularity'

/**
 * Venda ao longo do tempo. Diferente de `SalesReport`, que fecha o período
 * num número só — é esta que desenha linha e sparkline.
 */
export type SalesSeries = {
  granularity: SeriesGranularity
  points: SalesSeriesPoint[]
}
