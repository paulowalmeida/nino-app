import type { Order } from '@shared/types/order/order'
import type { OrderChannel } from '@shared/types/order/order-channel'

export const counterOrderMock: Order = {
  id: 'order-1',
  orderNumber: 41,
  tenantId: 'tenant-1',
  customerId: null,
  status: 'PREPARING',
  channel: 'COUNTER',
  courierId: null,
  deliveryAddress: null,
  tableNumber: null,
  notes: null,
  subtotal: '20.00',
  deliveryFee: '0.00',
  totalAmount: '20.00',
  deliveryZoneName: null,
  paymentMethod: 'CASH',
  paymentStatus: 'PAID',
  changeFor: null,
  cancelReason: null,
  cancelledBy: null,
  guestName: 'Cliente teste',
  guestPhone: '11999999999',
  guestStreet: null,
  guestNumber: null,
  guestComplement: null,
  guestNeighborhood: null,
  guestCity: null,
  guestState: null,
  guestZipCode: null,
  acceptedAt: null,
  deliveredAt: null,
  cancelledAt: null,
  createdAt: '2026-08-26T12:00:00.000Z',
  items: [],
  statusHistory: [],
}

export const tableOrderMock: Order = {
  ...counterOrderMock,
  id: 'order-2',
  orderNumber: 42,
  tableNumber: '7',
}

export const deliveryOrderMock: Order = {
  ...counterOrderMock,
  id: 'order-3',
  orderNumber: 43,
  channel: 'DELIVERY',
}

export const singleFormatStoreMock: OrderChannel[] = ['DELIVERY']

export const multiFormatStoreMock: OrderChannel[] = [
  'DELIVERY',
  'PICKUP',
  'COUNTER',
]
