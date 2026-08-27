import type { Order } from '@shared/types/order/order'

export const cashOnDeliveryOrderMock = {
  id: 'order-1',
  channel: 'DELIVERY',
  paymentMethod: 'CASH',
  paymentStatus: 'PENDING',
  changeFor: 50,
} as unknown as Order

export const paidOrderMock = {
  id: 'order-2',
  channel: 'DELIVERY',
  paymentMethod: 'PIX',
  paymentStatus: 'PAID',
  changeFor: null,
} as unknown as Order
