import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'

const order: GuestOrderStatus = {
  id: 'order-1',
  orderNumber: 42,
  status: 'PREPARING',
  estimatedDeliveryAt: '2026-08-29T20:00:00.000Z',
  createdAt: '2026-08-29T19:00:00.000Z',
  timeline: [{ status: 'PREPARING', at: '2026-08-29T19:10:00.000Z' }],
}

export const orderTrackingMock = {
  backHref: '/loja',
  order,
  progress: 0.5,
}
