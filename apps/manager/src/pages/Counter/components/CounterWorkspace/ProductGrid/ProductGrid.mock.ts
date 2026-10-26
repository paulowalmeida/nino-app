import type { CartLine } from '@shared/types/counter/cart-line'

export const productGridMock = { sections: [], isPending: false }

export const productGridPickedLines: CartLine[] = [
  { productId: 'item-1', name: 'Café', unitPrice: '10', quantity: 1 },
]
