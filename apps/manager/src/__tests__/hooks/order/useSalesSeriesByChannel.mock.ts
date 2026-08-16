import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type {
  SalesSeriesBreakdown,
} from '@custom_types/order/sales-series-breakdown'

export const weekRange: ReportRangeParams = { period: 'week' }

export const salesSeriesByChannel: SalesSeriesBreakdown = {
  granularity: 'day',
  series: [
    {
      key: 'DELIVERY',
      points: [
        {
          at: '2026-07-01T00:00:00.000Z',
          revenue: 100,
          orderCount: 1,
          averageTicket: 100,
        },
      ],
    },
  ],
}
