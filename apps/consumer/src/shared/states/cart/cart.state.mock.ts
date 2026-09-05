import type { CartItem } from '@custom_types/cart/cart-item'

export const cartStateMock: {
  tenantId: string
  otherTenantId: string
  item: CartItem
} = {
  tenantId: 'store-1',
  otherTenantId: 'store-2',
  item: {
    id: 'item-1',
    name: 'Café',
    price: '5',
    imageUrl: null,
    modifiers: [],
  },
}
