import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

export const requiredSingleGroupMock = {
  id: 'modifier-doneness',
  name: 'Ponto da carne',
  description: null,
  role: 'COMPOSITION',
  minSelections: 1,
  maxSelections: 1,
  options: [
    { id: 'option-medium', name: 'Ao ponto', price: '0' },
    { id: 'option-well-done', name: 'Bem passado', price: '0' },
  ],
} satisfies MenuItemModifier

export const optionalMultipleGroupMock = {
  id: 'modifier-extras',
  name: 'Adicionais',
  description: null,
  role: 'ADDITION',
  minSelections: 0,
  maxSelections: 2,
  options: [
    { id: 'option-bacon', name: 'Bacon extra', price: '6' },
    { id: 'option-cheese', name: 'Queijo extra', price: '4' },
  ],
} satisfies MenuItemModifier
