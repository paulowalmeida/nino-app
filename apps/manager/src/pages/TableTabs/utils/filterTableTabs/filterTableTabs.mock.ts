import type { Order } from '@shared/types/order/order'

export const tableTabSearchOrdersMock = [
  { orderNumber: 42, guestName: 'Ana Souza', tableNumber: 'Mesa 4' },
  { orderNumber: 43, guestName: 'Bruno Lima', tableNumber: 'Mesa 12' },
] satisfies Pick<Order, 'guestName' | 'tableNumber' | 'orderNumber'>[]
