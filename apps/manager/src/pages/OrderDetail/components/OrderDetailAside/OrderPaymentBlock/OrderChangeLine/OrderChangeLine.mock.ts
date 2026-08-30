import type { Order } from '@shared/types/order/order'

export const deliveryChangeOrderMock = {
  id: 'order-1',
  channel: 'DELIVERY',
  paymentMethod: 'CASH',
  totalAmount: '47.90',
  changeFor: '50',
} as unknown as Order

export const counterChangeOrderMock = {
  id: 'order-2',
  channel: 'COUNTER',
  paymentMethod: 'CASH',
  totalAmount: '47.90',
  changeFor: '50',
} as unknown as Order

export const exactCounterOrderMock = {
  id: 'order-3',
  channel: 'COUNTER',
  paymentMethod: 'CASH',
  totalAmount: '47.90',
  changeFor: null,
} as unknown as Order
