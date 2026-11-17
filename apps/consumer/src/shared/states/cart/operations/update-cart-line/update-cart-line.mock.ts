import type { CartItem } from '@custom_types/cart/cart-item'

export const updateCartLineMock: {
  plain: CartItem
  withBacon: CartItem
} = {
  plain: {
    id: 'item-1',
    name: 'X-Burger',
    price: '20',
    imageUrl: null,
  },
  withBacon: {
    id: 'item-1',
    name: 'X-Burger',
    price: '20',
    imageUrl: null,
    modifiers: [{ optionId: 'bacon', name: 'Bacon', price: '4', quantity: 1 }],
    notes: 'Sem cebola',
  },
}
