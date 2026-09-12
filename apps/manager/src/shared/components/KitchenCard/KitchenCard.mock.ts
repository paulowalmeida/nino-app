import type { Order } from '@shared/types/order/order'
import type { OrderDestination } from '@shared/types/order/order-destination'

export const tableDestinationMock: OrderDestination = {
  kind: 'table',
  label: 'Mesa 7',
}

export const kitchenCardOrderMock: Order = {
  id: 'order-1234',
  orderNumber: 1234,
  tenantId: 'tenant-1',
  consumerId: null,
  status: 'PENDING',
  channel: 'DELIVERY',
  courierId: null,
  deliveryAddress: null,
  tableNumber: null,
  notes: 'Sem cebola',
  subtotal: '20.00',
  deliveryFee: '5.00',
  totalAmount: '25.00',
  deliveryZoneName: null,
  paymentMethod: 'CASH',
  paymentStatus: 'PENDING',
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
  items: [
    {
      id: 'line-1',
      productId: 'product-1',
      quantity: 2,
      unitPrice: '10.00',
      product: { id: 'product-1', name: 'X-Tudo' },
    },
  ],
  statusHistory: [],
}

/** Relógio de referência dos pedidos abaixo — o teste fixa a hora nele. */
export const kitchenCardNowMock = '2026-08-01T12:00:00.000Z'

/** Entrou 8 min atrás: dentro do prazo de 20, com 12 pela frente. */
export const kitchenCardFreshOrderMock: Order = {
  ...kitchenCardOrderMock,
  id: 'order-fresh',
  orderNumber: 1235,
  status: 'ACCEPTED',
  createdAt: '2026-08-01T11:52:00.000Z',
}

/** Entrou 40 min atrás: 20 minutos além do prazo. */
export const kitchenCardLateOrderMock: Order = {
  ...kitchenCardOrderMock,
  id: 'order-late',
  orderNumber: 1237,
  status: 'PREPARING',
  createdAt: '2026-08-01T11:20:00.000Z',
}
