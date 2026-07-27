import type { SalesSeriesPoint, SeriesGranularity } from '@custom_types/order'

/** O que a linha mede — muda o eixo e o formato do valor. */
export type SalesMetric = 'revenue' | 'orderCount'

export type SalesChartProps = {
  points: SalesSeriesPoint[]
  granularity: SeriesGranularity
  /** Default: `revenue` */
  metric?: SalesMetric
  /** Altura do desenho em px. Default: `240` */
  height?: number
  /** Nome acessível — o gráfico é uma imagem para quem não o enxerga. */
  label: string
}
