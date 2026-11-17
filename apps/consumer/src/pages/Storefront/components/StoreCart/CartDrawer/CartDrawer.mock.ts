import type { CartLine } from '@custom_types/cart/cart-line'

const lines: CartLine[] = [
  {
    id: 'line|1',
    quantity: 1,
    item: {
      id: 'product-1',
      name: 'X-Salada',
      price: '20',
      imageUrl: null,
    },
  },
  {
    id: 'combo',
    quantity: 1,
    item: {
      id: 'combo',
      name: 'Combo',
      price: '30',
      imageUrl: null,
      package: { listPrice: 40 } as never,
    },
  },
]

export const cartDrawerMock = { open: true, total: 25, lines }
