import type { CartItem } from '@custom_types/cart/cart-item'

export const useCartSummaryMock: { tenantId: string; cartItem: CartItem } = {
  tenantId: 'store-1',
  cartItem: {
    id: 'item-1',
    name: 'Hambúrguer',
    price: '25.5',
    imageUrl: null,
  },
}
