import type { CartItem } from '@custom_types/cart/cart-item'

const base: CartItem = {
  id: 'item-1',
  name: 'Burger',
  price: '20',
  imageUrl: null,
  modifiers: [],
}

export const cartLineKeyMock = {
  plain: base,
  withBacon: {
    ...base,
    modifiers: [
      { optionId: 'bacon', name: 'Bacon', price: '4', quantity: 1 },
    ],
  },
  withBaconReversed: {
    ...base,
    modifiers: [
      { optionId: 'cheddar', name: 'Cheddar', price: '3', quantity: 1 },
      { optionId: 'bacon', name: 'Bacon', price: '4', quantity: 1 },
    ],
  },
  withCheddarFirst: {
    ...base,
    modifiers: [
      { optionId: 'bacon', name: 'Bacon', price: '4', quantity: 1 },
      { optionId: 'cheddar', name: 'Cheddar', price: '3', quantity: 1 },
    ],
  },
  withNotes: { ...base, notes: 'sem cebola' },
} satisfies Record<string, CartItem>
