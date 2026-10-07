import type { PeriodChoice } from '@shared/types/ui/period-choice'

export const CHART_PALETTE = [
  'primarySeries',
  'secondarySeries',
  'tertiarySeries',
  'quaternarySeries',
] as const
export const TOP_SALES_TABLE_GHOST_ROWS = ['one', 'two', 'three', 'four', 'five']

export const REPORTS_PERIODS: { id: PeriodChoice; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: '7 dias' },
  { id: 'fortnight', label: '15 dias' },
  { id: 'month', label: '30 dias' },
  { id: 'custom', label: 'Escolher' },
]

export const REPORTS_FIGURES = [
  { key: 'revenue' as const, label: 'Faturamento', money: true },
  { key: 'orderCount' as const, label: 'Pedidos concluídos', money: false },
  { key: 'averageTicket' as const, label: 'Ticket médio', money: true },
]

export const REPORTS_TIMING_FIGURES = [
  { key: 'averagePreparationMinutes' as const, sampleKey: 'preparationSampleSize' as const, label: 'Tempo médio de preparo', empty: 'Sem pedidos no período' },
  { key: 'averageDeliveryMinutes' as const, sampleKey: 'deliverySampleSize' as const, label: 'Tempo médio de entrega', empty: 'Sem entregas no período' },
]
