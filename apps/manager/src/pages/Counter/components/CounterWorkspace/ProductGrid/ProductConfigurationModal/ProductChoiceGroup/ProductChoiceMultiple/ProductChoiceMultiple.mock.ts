import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

export const additionGroupMock = {
  id: 'modifier-extras',
  name: 'Adicionais',
  description: null,
  role: 'ADDITION',
  minSelections: 0,
  maxSelections: 2,
  options: [
    { id: 'option-bacon', name: 'Bacon extra', price: '6' },
    { id: 'option-onion', name: 'Cebola', price: '0' },
  ],
} satisfies MenuItemModifier

export const compositionGroupMock = {
  ...additionGroupMock,
  id: 'modifier-bread',
  name: 'Pão',
  role: 'COMPOSITION',
  options: [{ id: 'option-brioche', name: 'Brioche', price: '3' }],
} satisfies MenuItemModifier
