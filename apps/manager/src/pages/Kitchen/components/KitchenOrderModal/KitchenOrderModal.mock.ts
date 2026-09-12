import type { Order } from '@shared/types/order/order'
import type { OrderChannel } from '@shared/types/order/order-channel'

export const kitchenOrderModalOrderMock: Order = {
  id: 'order-1234',
  orderNumber: 1234,
  tenantId: 'tenant-1',
  consumerId: null,
  status: 'PREPARING',
  channel: 'TABLE_TAB',
  courierId: null,
  deliveryAddress: null,
  tableNumber: '7',
  notes: 'Sem cebola',
  subtotal: '20.00',
  deliveryFee: '0.00',
  totalAmount: '20.00',
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

export const kitchenOrderModalSalesFormatsMock: OrderChannel[] = [
  'DELIVERY',
  'TABLE_TAB',
]
