import type { CartItem } from '@custom_types/cart/cart-item'

export const useCartSummaryMock: { unitId: string; cartItem: CartItem } = {
  unitId: 'store-1',
  cartItem: {
    id: 'item-1',
    name: 'Hambúrguer',
    price: '25.5',
    imageUrl: null,
    modifiers: [],
  },
}
