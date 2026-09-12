import type { InfiniteData } from '@tanstack/react-query'

import type { Order } from '@shared/types/order/order'
import type { OrderPage } from '@shared/types/order/order-page'

export const preparingOrderMock: Order = {
  id: 'order-1',
  orderNumber: 77,
  tenantId: 'tenant-1',
  consumerId: null,
  status: 'PREPARING',
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

export const otherOrderMock: Order = {
  ...preparingOrderMock,
  id: 'order-2',
  orderNumber: 78,
}

/** Trilho ativo: guarda o pedido em preparo. */
export const activeListMock: InfiniteData<OrderPage> = {
  pages: [
    {
      data: [preparingOrderMock, otherOrderMock],
      pagination: { total: 2, page: 1, size: 20 },
    },
  ],
  pageParams: [1],
}

/** Trilho de saída: ainda vazio. */
export const finishedListMock: InfiniteData<OrderPage> = {
  pages: [{ data: [], pagination: { total: 0, page: 1, size: 20 } }],
  pageParams: [1],
}
