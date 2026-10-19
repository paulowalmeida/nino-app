import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

export const tabItemModifierPickerMock = {
  modifiers: [
    {
      id: 'modifier-1',
      name: 'Ponto da carne',
      description: null,
      role: 'COMPOSITION',
      minSelections: 1,
      maxSelections: 1,
      options: [
        { id: 'option-1', name: 'Ao ponto', price: '0.00' },
        { id: 'option-2', name: 'Bem passado', price: '2.00' },
      ],
    },
    {
      id: 'modifier-2',
      name: 'Adicionais',
      description: null,
      role: 'ADDITION',
      minSelections: 0,
      maxSelections: 2,
      options: [
        { id: 'option-3', name: 'Bacon', price: '3.00' },
        { id: 'option-4', name: 'Queijo', price: '0.00' },
        { id: 'option-5', name: 'Ovo', price: '2.50' },
      ],
    },
  ] as MenuItemModifier[],
}
