import type { MenuSection } from '@shared/types/product/menu-section'

const category = { id: 'category-1', name: 'Salgados', position: 0 }

export const menuImagesReadySectionsMock: MenuSection[] = [
  {
    id: 'section-1',
    name: 'Salgados',
    position: 0,
    items: [
      {
        id: 'active-item',
        name: 'Coxinha',
        description: null,
        price: '8.50',
        isActive: true,
        position: 0,
        category,
        images: [
          { id: 'active-image', url: '/active-coxinha.png', isPrimary: true },
        ],
      },
      {
        id: 'inactive-item',
        name: 'Pastel',
        description: null,
        price: '9.00',
        isActive: false,
        position: 1,
        category,
        images: [
          {
            id: 'inactive-image',
            url: '/inactive-pastel.png',
            isPrimary: true,
          },
        ],
      },
    ],
  },
]
