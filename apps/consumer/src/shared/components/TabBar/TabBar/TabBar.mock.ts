import type { Consumer } from '@custom_types/consumer/consumer'
import type { MyOrder } from '@custom_types/order/my-order'
import type { GuestOrderReference } from '@shared/lib/last-order/last-order'

export const consumerMock: Consumer = {
  id: 'consumer-1',
  name: 'Ana Souza',
  phone: '11999990000',
  email: null,
  photoUrl: null,
  cpf: null,
  isActive: true,
  lastLoginAt: '2026-09-28T12:00:00.000Z',
  profileCompletedAt: '2026-01-10T12:00:00.000Z',
  createdAt: '2026-01-10T12:00:00.000Z',
  updatedAt: '2026-09-28T12:00:00.000Z',
}

export const guestOrderMock: GuestOrderReference = {
  orderId: 'order-1',
  token: 'token-1',
  slug: 'demo',
  createdAt: '2026-09-28T12:00:00.000Z',
  lastSeenEventAt: null,
  terminalAt: null,
  expiresAt: '2026-10-05T12:00:00.000Z',
}

export const activeMyOrderMock: MyOrder = {
  id: 'order-2',
  orderNumber: 201,
  status: 'PREPARING',
  channel: 'DELIVERY',
  totalAmount: '42.00',
  createdAt: '2026-09-28T12:00:00.000Z',
  estimatedDeliveryAt: null,
}

export const deliveredMyOrderMock: MyOrder = {
  ...activeMyOrderMock,
  id: 'order-3',
  status: 'DELIVERED',
}
