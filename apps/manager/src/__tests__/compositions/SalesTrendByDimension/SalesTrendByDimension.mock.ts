import type {
  SalesSeriesBreakdown,
} from '@custom_types/order/sales-series-breakdown'

export const emptyBreakdown: SalesSeriesBreakdown = {
  granularity: 'day',
  series: [
    {
      key: 'DELIVERY',
      points: [
        {
          at: '2026-07-01T00:00:00.000Z',
          revenue: 0,
          orderCount: 0,
          averageTicket: 0,
        },
        {
          at: '2026-07-02T00:00:00.000Z',
          revenue: 0,
          orderCount: 0,
          averageTicket: 0,
        },
      ],
    },
  ],
}

export const twoDayBreakdown: SalesSeriesBreakdown = {
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
        {
          at: '2026-07-02T00:00:00.000Z',
          revenue: 200,
          orderCount: 2,
          averageTicket: 100,
        },
      ],
    },
  ],
}
