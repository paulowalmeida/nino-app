import type { Order } from '@shared/types/order/order'

export const cardHeightMock = 160

const base: Order = {
  id: 'order-a',
  orderNumber: 1,
  unitId: 'unit-1',
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

export const preparingOrderMock: Order = base
export const otherPreparingOrderMock: Order = { ...base, id: 'order-b' }
export const waitingOrderMock: Order = {
  ...base,
  id: 'order-c',
  status: 'ACCEPTED',
}
export const finishedOrderMock: Order = {
  ...base,
  id: 'order-d',
  status: 'READY_FOR_PICKUP',
}

export const wallMock = {
  waiting: [waitingOrderMock],
  preparing: [preparingOrderMock, otherPreparingOrderMock],
  finished: [finishedOrderMock],
}
