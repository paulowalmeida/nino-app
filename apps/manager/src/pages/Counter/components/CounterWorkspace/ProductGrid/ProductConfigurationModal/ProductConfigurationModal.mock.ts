import type { MenuItem } from '@shared/types/product/menu-item'

export const configurableProductMock: MenuItem = {
  id: 'item-1',
  name: 'X-Salada',
  description: null,
  price: '24.9',
  pricingType: 'FIXED',
  isActive: true,
  position: 1,
  images: [],
  category: { id: 'category-1', name: 'Lanches', position: 1 },
  modifiers: [
    {
      id: 'modifier-1',
      name: 'Ponto da carne',
      description: 'Escolha como quer o hambúrguer',
      role: 'COMPOSITION',
      minSelections: 1,
      maxSelections: 1,
      options: [
        { id: 'option-1', name: 'Ao ponto', price: '0' },
        { id: 'option-2', name: 'Bem passado', price: '0' },
      ],
    },
    {
      id: 'modifier-2',
      name: 'Adicionais',
      description: null,
      role: 'ADDITION',
      minSelections: 0,
      maxSelections: 1,
      options: [{ id: 'option-3', name: 'Bacon extra', price: '6' }],
    },
  ],
}
