import type { Order } from '@shared/types/order/order'

export const readyForPickupOrderMock: Order = {
  id: 'order-ready',
  orderNumber: 88,
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
  createdAt: '2026-08-26T12:00:00.000Z',
  items: [],
  statusHistory: [],
}

export const acceptedOrderMock: Order = {
  ...readyForPickupOrderMock,
  id: 'order-accepted',
  status: 'ACCEPTED',
}

export const kitchenColumnMock = {
  stage: 'waiting' as const,
  title: 'Aguardando preparo',
  empty: 'Nenhum pedido aguardando preparo.',
  ownsNextStep: true,
  isCompact: false,
}

export const kitchenFinishedColumnMock = {
  stage: 'finished' as const,
  title: 'Saiu da cozinha',
  empty: 'Nada saiu nos últimos 90 minutos.',
  ownsNextStep: false,
  isCompact: false,
}
