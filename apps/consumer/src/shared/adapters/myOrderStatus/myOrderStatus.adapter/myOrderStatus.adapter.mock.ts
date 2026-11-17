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
  withDetails: {
    items: [
      {
        id: 'item-1',
        quantity: 1,
        unitPrice: '30.00',
        notes: null,
        status: 'ACTIVE' as const,
        isGift: false,
        product: { name: 'Pizza' },
        modifiers: [
          { quantity: 1, unitPrice: '5.00', option: { name: 'Borda' } },
        ],
      },
      {
        id: 'item-2',
        quantity: 1,
        unitPrice: '9.00',
        notes: null,
        status: 'CANCELLED' as const,
        isGift: false,
        product: { name: 'Suco' },
        modifiers: [],
      },
    ],
    subtotal: '35.00',
    totalAmount: '35.00',
    paymentMethod: 'PIX' as const,
  },
}
