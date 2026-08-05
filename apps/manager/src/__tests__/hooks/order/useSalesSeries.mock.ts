import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type { SalesSeries } from '@custom_types/order/sales-series'
export const weekRange: ReportRangeParams = { period: 'week' }

export const salesSeries: SalesSeries = {
  granularity: 'day',
  points: [
    {
      at: '2026-07-01T00:00:00.000Z',
      revenue: 100,
      orderCount: 1,
      averageTicket: 100,
    },
  ],
}
