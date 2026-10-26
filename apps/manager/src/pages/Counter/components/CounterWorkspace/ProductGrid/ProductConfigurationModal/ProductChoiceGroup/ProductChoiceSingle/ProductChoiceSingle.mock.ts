import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

export const breadChoiceGroupMock = {
  id: 'modifier-bread',
  name: 'Pão',
  description: null,
  role: 'COMPOSITION',
  minSelections: 1,
  maxSelections: 1,
  options: [
    { id: 'option-sesame', name: 'Gergelim', price: '0' },
    { id: 'option-brioche', name: 'Brioche', price: '3' },
  ],
} satisfies MenuItemModifier

export const sauceChoiceGroupMock = {
  ...breadChoiceGroupMock,
  id: 'modifier-sauce',
  name: 'Molho',
  role: 'ADDITION',
  options: [{ id: 'option-cheddar', name: 'Cheddar', price: '2' }],
} satisfies MenuItemModifier
