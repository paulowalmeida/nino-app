import type { ReportRangeParams, SalesSeries } from '@custom_types/order'

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
