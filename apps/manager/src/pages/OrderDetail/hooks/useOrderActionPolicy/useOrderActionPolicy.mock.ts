import type { Order } from '@shared/types/order/order'

export const pendingOrderMock = {
  id: 'order-1',
  status: 'PENDING',
  channel: 'DELIVERY',
  paymentStatus: 'PENDING',
} as unknown as Order

export const cancelledOrderMock = {
  id: 'order-2',
  status: 'CANCELLED',
  channel: 'DELIVERY',
  paymentStatus: 'PENDING',
} as unknown as Order

export const deliveredOrderMock = {
  id: 'order-3',
  status: 'DELIVERED',
  channel: 'DELIVERY',
  paymentStatus: 'PAID',
} as unknown as Order
