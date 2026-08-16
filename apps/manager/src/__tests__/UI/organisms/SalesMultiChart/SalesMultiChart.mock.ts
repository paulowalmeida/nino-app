import type { SalesSeriesLine } from '@custom_types/order/sales-series-line'

export const twoLinesTwoDays: SalesSeriesLine[] = [
  {
    key: 'DELIVERY',
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
        averageTicket: 100,
      },
    ],
  },
  {
    key: 'PICKUP',
    points: [
      {
        at: '2026-07-01T00:00:00.000Z',
        revenue: 50,
        orderCount: 1,
        averageTicket: 50,
      },
      {
        at: '2026-07-02T00:00:00.000Z',
        revenue: 0,
        orderCount: 0,
        averageTicket: 0,
      },
    ],
  },
]

export const singleLineSingleDay: SalesSeriesLine[] = [
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
]
