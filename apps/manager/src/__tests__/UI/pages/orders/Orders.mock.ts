import type { Membership } from '@custom_types/auth/membership'
import type { Order } from '@custom_types/order/order'

export const currentTenant = { tenantId: 'tenant-1' } as Membership

export const closedOrder: Order = {
  id: 'order-abcd1234',
  tenantId: 'tenant-1',
  customerId: null,
  status: 'COMPLETED',
  channel: 'COUNTER',
  courierId: null,
  deliveryAddress: null,
  tableNumber: null,
  notes: null,
  subtotal: '30.00',
  deliveryFee: '0.00',
  totalAmount: '30.00',
  deliveryZoneName: null,
  paymentMethod: 'CASH',
  paymentStatus: 'PAID',
  changeFor: null,
  cancelReason: null,
  cancelledBy: null,
  guestName: 'Weskley Almeida',
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
  createdAt: '2026-01-05T14:30:00.000Z',
  items: [
    {
      id: 'item-1',
      productId: 'product-1',
      quantity: 1,
      unitPrice: '30.00',
      product: { id: 'product-1', name: 'X-Salada' },
    },
  ],
  statusHistory: [],
}
