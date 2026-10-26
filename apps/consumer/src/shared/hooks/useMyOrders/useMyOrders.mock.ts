import type { MyOrder } from '@custom_types/order/my-order'

export const useMyOrdersMock: { orders: MyOrder[] } = {
  orders: [
    {
      id: 'order-1',
      orderNumber: 42,
      status: 'DELIVERED',
      channel: 'DELIVERY',
      totalAmount: '58.9',
      createdAt: '2026-08-20T18:30:00.000Z',
      estimatedDeliveryAt: null,
    },
  ],
}
