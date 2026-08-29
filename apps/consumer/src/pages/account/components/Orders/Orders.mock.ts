import type { MyOrder } from '@custom_types/order/my-order'

const delivered: MyOrder = {
  id: 'order-1',
  orderNumber: 42,
  status: 'DELIVERED',
  channel: 'DELIVERY',
  totalAmount: '58.9',
  createdAt: '2026-08-20T18:30:00.000Z',
  estimatedDeliveryAt: null,
}

const preparing: MyOrder = {
  id: 'order-2',
  orderNumber: 43,
  status: 'PREPARING',
  channel: 'DELIVERY',
  totalAmount: '32.5',
  createdAt: '2026-08-27T18:30:00.000Z',
  estimatedDeliveryAt: '2026-08-27T19:15:00.000Z',
}

export const ordersMock = {
  orders: [delivered],
  pendingOrders: [preparing],
}
