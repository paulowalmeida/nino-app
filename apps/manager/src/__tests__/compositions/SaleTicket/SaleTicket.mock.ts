import type { CartLine } from '@custom_types/counter/cart-line'
export const coxinhaLine: CartLine = {
  productId: 'item-1',
  name: 'Coxinha',
  unitPrice: '8.50',
  quantity: 1,
}

export const twoCoxinhaLine: CartLine = {
  ...coxinhaLine,
  quantity: 2,
}
