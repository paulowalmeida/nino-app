import { myOrderStatusMock } from '@shared/adapters/myOrderStatus/myOrderStatus.adapter/myOrderStatus.adapter.mock'

export const guestOrderStatusMock = {
  response: {
    id: 'order-1',
    orderNumber: 42,
    status: 'PREPARING' as const,
    channel: 'DELIVERY' as const,
    estimatedDeliveryAt: null,
    createdAt: '2026-08-29T19:00:00.000Z',
    timeline: [
      { status: 'PREPARING' as const, at: '2026-08-29T19:10:00.000Z' },
    ],
  },
  withDetails: {
    ...myOrderStatusMock.withDetails,
    deliveryAddress: {
      street: 'Rua A',
      number: '1',
      complement: null,
      neighborhood: 'Centro',
      city: 'Belém',
      state: 'PA',
    },
  },
}
