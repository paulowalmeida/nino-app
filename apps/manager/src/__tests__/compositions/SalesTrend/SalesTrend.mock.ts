import type { SalesSeries } from '@custom_types/order'

export const emptySeries: SalesSeries = {
  granularity: 'day',
  points: [
    {
      at: '2026-07-01T00:00:00.000Z',
      revenue: 0,
      orderCount: 1,
      averageTicket: 0,
    },
    {
      at: '2026-07-02T00:00:00.000Z',
      revenue: 0,
      orderCount: 2,
      averageTicket: 0,
    },
  ],
}

export const twoDaySeries: SalesSeries = {
  granularity: 'day',
  points: [
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
  ],
}
