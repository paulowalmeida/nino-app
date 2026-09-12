import type { Order } from '@shared/types/order/order'

const base: Order = {
  id: 'order-a',
  orderNumber: 1,
  tenantId: 'tenant-1',
  consumerId: null,
  status: 'PREPARING',
  channel: 'PICKUP',
  courierId: null,
  deliveryAddress: null,
  tableNumber: null,
  notes: null,
  subtotal: '10.00',
  deliveryFee: '0.00',
  totalAmount: '10.00',
  deliveryZoneName: null,
  paymentMethod: 'CASH',
  paymentStatus: 'PAID',
  changeFor: null,
  cancelReason: null,
  cancelledBy: null,
  guestName: 'Cliente teste',
  guestPhone: null,
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
  createdAt: '2026-08-01T12:00:00.000Z',
  items: [],
  statusHistory: [],
}

export const orderAMock: Order = base
export const orderBMock: Order = { ...base, id: 'order-b', orderNumber: 2 }
export const orderCMock: Order = { ...base, id: 'order-c', orderNumber: 3 }

export const naturalQueueMock: Order[] = [orderAMock, orderBMock, orderCMock]
