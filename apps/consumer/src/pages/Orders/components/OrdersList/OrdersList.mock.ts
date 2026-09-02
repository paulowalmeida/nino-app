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
  ...delivered,
  id: 'order-2',
  status: 'PREPARING',
  totalAmount: '32.5',
}

export const ordersListMock = {
  orders: [delivered],
  pendingOrders: [preparing],
  slug: 'loja',
}
