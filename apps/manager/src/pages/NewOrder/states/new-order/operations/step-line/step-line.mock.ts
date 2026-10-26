import type { CartLine } from '@shared/types/counter/cart-line'

export const ticketLinesMock: CartLine[] = [
  {
    productId: 'product-1',
    name: 'Coxinha',
    unitPrice: '7.50',
    quantity: 2,
  },
  {
    productId: 'product-2',
    name: 'Pastel',
    unitPrice: '9.00',
    quantity: 1,
  },
]
