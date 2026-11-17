import type { CartItemModifier } from '@custom_types/cart/cart-item-modifier'
import type { MenuItem } from '@custom_types/menu/menu-item'

export const selectionsFromModifiersMock: {
  product: Pick<MenuItem, 'modifiers'>
  modifiers: CartItemModifier[]
} = {
  product: {
    modifiers: [
      {
        id: 'ponto',
        name: 'Ponto',
        description: null,
        isRequired: true,
        maxSelections: 1,
        options: [
          { id: 'mal', name: 'Mal passado', price: '0' },
          { id: 'bem', name: 'Bem passado', price: '0' },
        ],
      },
      {
        id: 'extras',
        name: 'Extras',
        description: null,
        isRequired: false,
        maxSelections: 3,
        options: [
          { id: 'bacon', name: 'Bacon', price: '4' },
          { id: 'ovo', name: 'Ovo', price: '3' },
        ],
      },
    ],
  },
  modifiers: [
    { optionId: 'bem', name: 'Bem passado', price: '0', quantity: 1 },
    { optionId: 'bacon', name: 'Bacon', price: '4', quantity: 1 },
    { optionId: 'ovo', name: 'Ovo', price: '3', quantity: 1 },
  ],
}
