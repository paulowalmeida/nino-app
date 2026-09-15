import type { Order } from '@shared/types/order/order'

const baseOrder: Order = {
  id: 'order-1',
  orderNumber: 1,
  unitId: 'unit-1',
  consumerId: null,
  status: 'READY_FOR_PICKUP',
  channel: 'PICKUP',
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
  createdAt: '2026-08-01T09:00:00.000Z',
  items: [],
  statusHistory: [],
}

/** Saiu às 11h50 — dentro de uma janela de 90 min contada a partir das 12h. */
export const justLeftKitchenMock: Order = {
  ...baseOrder,
  id: 'order-recent',
  statusHistory: [
    {
      id: 'entry-1',
      status: 'READY_FOR_PICKUP',
      changedByRealm: 'OPERATIONAL',
      createdAt: '2026-08-01T11:50:00.000Z',
    },
  ],
}

/** Saiu às 9h30 — histórico, não operação. */
export const leftKitchenHoursAgoMock: Order = {
  ...baseOrder,
  id: 'order-old',
  statusHistory: [
    {
      id: 'entry-2',
      status: 'READY_FOR_PICKUP',
      changedByRealm: 'OPERATIONAL',
      createdAt: '2026-08-01T09:30:00.000Z',
    },
  ],
}

/** Sem histórico: cai na criação, que aqui é antiga. */
export const withoutHistoryMock: Order = {
  ...baseOrder,
  id: 'order-no-history',
}
