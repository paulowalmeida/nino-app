import type { CartLine } from '@shared/types/counter/cart-line'

export const storeLineMock: Omit<CartLine, 'quantity'> = {
  productId: 'product-1',
  name: 'Coxinha',
  unitPrice: '7.50',
}

export const storeDraftMock = {
  notes: 'Sem cebola',
  recipientName: 'Maria',
}
