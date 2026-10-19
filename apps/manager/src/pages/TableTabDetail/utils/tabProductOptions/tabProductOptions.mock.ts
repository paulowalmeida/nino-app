import type { MenuSection } from '@shared/types/product/menu-section'

export const tabProductSectionsMock = [
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
        name: 'Pastel de carne',
        price: '20.00',
        isActive: false,
      },
    ],
  },
  {
    id: 'category-2',
    name: 'Bebidas',
    position: 1,
    items: [
      { id: 'product-3', name: 'Caldo de cana', price: '9.00', isActive: true },
    ],
  },
] as unknown as MenuSection[]

export const tabProductOptionsExpectedMock = [
  { value: 'product-1', label: 'Pastel de queijo · R$\u00a018,00' },
  { value: 'product-3', label: 'Caldo de cana · R$\u00a09,00' },
]
