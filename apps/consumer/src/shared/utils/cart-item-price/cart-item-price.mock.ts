import type { CartItem } from '@custom_types/cart/cart-item'

const base: CartItem = {
  id: 'item-1',
  name: 'Burger',
  price: '20.50',
  imageUrl: null,
  modifiers: [],
}

export const cartItemPriceMock = {
  plain: base,
  withExtras: {
    ...base,
    modifiers: [
      { optionId: 'bacon', name: 'Bacon', price: '4', quantity: 2 },
      { optionId: 'cheddar', name: 'Cheddar', price: '3.50', quantity: 1 },
    ],
  },
} satisfies Record<string, CartItem>
