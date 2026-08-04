import type { SalesSeriesPoint } from '@custom_types/order'

export const threeDayPoints: SalesSeriesPoint[] = [
  {
    at: '2026-07-01T00:00:00.000Z',
    revenue: 100,
    orderCount: 1,
    averageTicket: 100,
  },
  {
    at: '2026-07-02T00:00:00.000Z',
    revenue: 200,
    orderCount: 2,
    averageTicket: 200,
  },
  {
    at: '2026-07-03T00:00:00.000Z',
    revenue: 150,
    orderCount: 3,
    averageTicket: 150,
  },
]

export const singleDayPoint: SalesSeriesPoint[] = [
  {
    at: '2026-07-01T00:00:00.000Z',
    revenue: 100,
    orderCount: 1,
    averageTicket: 100,
  },
]
