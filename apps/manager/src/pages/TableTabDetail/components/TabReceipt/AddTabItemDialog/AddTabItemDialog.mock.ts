import type { MenuSection } from '@shared/types/product/menu-section'

export const addTabItemDialogMock = {
  sections: [
    {
      id: 'category-1',
      name: 'Salgados',
      position: 0,
      items: [
        {
          id: 'product-1',
          name: 'Pastel de queijo',
          price: '18.00',
          isActive: true,
        },
        {
          id: 'product-2',
          name: 'Hambúrguer',
          price: '30.00',
          isActive: true,
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
                { id: 'option-2', name: 'Bem passado', price: '0.00' },
              ],
            },
          ],
        },
      ],
    },
  ] as unknown as MenuSection[],
  productLabel: /Pastel de queijo/,
  burgerLabel: /Hambúrguer/,
  notes: '  sem cebola  ',
}
