import type { CartItem } from '@custom_types/cart/cart-item'

export const cartStateMock: {
  unitId: string
  otherUnitId: string
  item: CartItem
} = {
  unitId: 'store-1',
  otherUnitId: 'store-2',
  item: {
    id: 'item-1',
    name: 'Café',
    price: '5',
    imageUrl: null,
    modifiers: [],
  },
}
