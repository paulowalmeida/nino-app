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
      ],
    },
  ] as unknown as MenuSection[],
  productLabel: /Pastel de queijo/,
  notes: '  sem cebola  ',
}
