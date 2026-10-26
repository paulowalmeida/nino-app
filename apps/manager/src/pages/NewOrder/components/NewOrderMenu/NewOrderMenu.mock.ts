import type { MenuSection } from '@shared/types/product/menu-section'

export const menuSectionsMock = [
  {
    id: 'section-1',
    name: 'Salgados',
    position: 1,
    items: [
      {
        id: 'product-1',
        name: 'Coxinha',
        price: 7.5,
        isActive: true,
        images: [],
      },
      {
        id: 'product-2',
        name: 'Pastel desligado',
        price: 9,
        isActive: false,
        images: [],
      },
    ],
  },
] as unknown as MenuSection[]
