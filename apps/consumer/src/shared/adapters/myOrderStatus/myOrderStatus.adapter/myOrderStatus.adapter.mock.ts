export const myOrderStatusMock = {
  response: {
    id: 'order-1',
    orderNumber: 42,
    status: 'PREPARING' as const,
    channel: 'DELIVERY' as const,
    estimatedDeliveryAt: null,
    createdAt: '2026-08-29T19:00:00.000Z',
    statusHistory: [
      { status: 'PREPARING' as const, createdAt: '2026-08-29T19:10:00.000Z' },
    ],
  },
}
