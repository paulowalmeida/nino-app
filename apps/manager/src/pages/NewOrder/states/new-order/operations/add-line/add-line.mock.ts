import type { CartLine } from '@shared/types/counter/cart-line'

export const newLineMock: Omit<CartLine, 'quantity'> = {
  productId: 'product-1',
  name: 'Coxinha',
  unitPrice: '7.50',
}

export const existingLineMock: CartLine = {
  productId: 'product-1',
  name: 'Coxinha',
  unitPrice: '7.50',
  quantity: 2,
}

export const otherLineMock: CartLine = {
  productId: 'product-2',
  name: 'Pastel',
  unitPrice: '9.00',
  quantity: 1,
}
