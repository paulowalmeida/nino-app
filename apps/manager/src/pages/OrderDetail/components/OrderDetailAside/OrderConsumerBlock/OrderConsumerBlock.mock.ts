import type { Order } from '@shared/types/order/order'

export const deliveryOrderMock = {
  id: 'order-1',
  status: 'PENDING',
  channel: 'DELIVERY',
  guestName: 'Ana Souza',
  guestPhone: '11988887777',
  guestStreet: 'Rua Olimpíadas',
  guestNumber: '55',
  guestComplement: null,
  guestNeighborhood: 'Vila Olímpia',
  tableNumber: null,
} as unknown as Order

export const counterOrderMock = {
  id: 'order-2',
  status: 'PENDING',
  channel: 'COUNTER',
  guestName: null,
  guestPhone: null,
  tableNumber: '4',
} as unknown as Order
