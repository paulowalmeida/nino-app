export const reportsContentMock = {
  report: {
    revenue: 120,
    orderCount: 4,
    averageTicket: 30,
    topProducts: [
      {
        productId: 'p1',
        name: 'Pastel',
        quantity: 3,
        unitPrice: 10,
        revenue: 30,
      },
    ],
    byChannel: [],
    byPaymentMethod: [],
  },
  timing: {
    averagePreparationMinutes: 12,
    averageDeliveryMinutes: 20,
    preparationSampleSize: 4,
    deliverySampleSize: 2,
  },
  trend: { granularity: 'day', points: [] },
  channelBreakdown: {
    granularity: 'day',
    series: [{ key: 'DELIVERY', points: [] }],
  },
  paymentBreakdown: {
    granularity: 'day',
    series: [{ key: 'PIX', points: [] }],
  },
  labels: { channel: { DELIVERY: 'Delivery' }, payment: { PIX: 'Pix' } },
  channelItems: [
    { id: 'DELIVERY', label: 'Delivery', value: 120, display: 'R$ 120,00' },
  ],
  paymentItems: [{ id: 'PIX', label: 'Pix', value: 120, display: 'R$ 120,00' }],
}
