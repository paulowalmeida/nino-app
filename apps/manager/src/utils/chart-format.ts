import type { SeriesGranularity } from '@custom_types/order/series-granularity'

export const chartHourLabel = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export const chartDayLabel = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

export const chartFullDateLabel = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export const chartCompactNumber = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const chartTickLabel = (
  granularity: SeriesGranularity,
  date: Date
): string =>
  (granularity === 'hour' ? chartHourLabel : chartDayLabel).format(date)
