export const unitIdMock = 'unit-1'

export const createOrderRequestMock = {
  channel: 'COUNTER' as const,
  paymentMethod: 'CASH' as const,
  items: [{ productId: 'product-1', quantity: 2, unitPrice: 8 }],
}

export const orderMock = { id: 'order-1', status: 'PENDING', total: 16 }
