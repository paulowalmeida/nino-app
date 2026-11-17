import type { CartLine } from '@custom_types/cart/cart-line'

export const useEditingCartLineMock: { line: CartLine } = {
  line: {
    id: 'item-1|baconx1|',
    quantity: 2,
    item: {
      id: 'item-1',
      name: 'X-Burger',
      price: '20',
      imageUrl: null,
      modifiers: [
        { optionId: 'bacon', name: 'Bacon', price: '4', quantity: 1 },
      ],
    },
  },
}
