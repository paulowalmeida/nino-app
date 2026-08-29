import type { GuestOrderCreatedResponse } from '@custom_types/order/guest-order-created-response'

export const orderConfirmedMock: GuestOrderCreatedResponse = {
  id: 'order-1',
  orderNumber: 42,
  status: 'PENDING',
  trackingToken: 'token-1',
  channel: 'PICKUP',
  paymentMethod: 'CASH',
  totalAmount: '42.00',
  estimatedDeliveryAt: null,
}
