import type { CartLine } from '@shared/types/counter/cart-line'

export const draftLinesMock: Omit<CartLine, 'quantity'>[] = [
  {
    productId: 'product-1',
    name: 'Coxinha',
    unitPrice: '7.50',
  },
  {
    productId: 'product-2',
    name: 'Pastel',
    unitPrice: '9.00',
  },
]

export const draftSubtotalMock = 24
