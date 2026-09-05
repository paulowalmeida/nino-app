import type { CartLine } from '@custom_types/cart/cart-line'

export const quantityByProductMock = {
  lines: [
    {
      id: 'item-1|bacon|',
      quantity: 2,
      item: {
        id: 'item-1',
        name: 'Burger',
        price: '20',
        imageUrl: null,
        modifiers: [
          { optionId: 'bacon', name: 'Bacon', price: '4', quantity: 1 },
        ],
      },
    },
    {
      id: 'item-1||',
      quantity: 1,
      item: {
        id: 'item-1',
        name: 'Burger',
        price: '20',
        imageUrl: null,
        modifiers: [],
      },
    },
    {
      id: 'item-2||',
      quantity: 5,
      item: {
        id: 'item-2',
        name: 'Suco',
        price: '8',
        imageUrl: null,
        modifiers: [],
      },
    },
  ],
} satisfies { lines: CartLine[] }
