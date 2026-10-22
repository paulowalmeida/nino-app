import type { MenuItem } from '@shared/types/product/menu-item'

const baseItem = {
  description: null,
  position: 0,
  category: { id: 'drinks', name: 'Bebidas', position: 0 },
  images: [],
} as unknown as MenuItem

export const giftMenuMock: MenuItem[] = [
  { ...baseItem, id: 'coke', name: 'Coca-Cola Lata', price: '6.50', isActive: true },
  { ...baseItem, id: 'paused', name: 'Suco', price: '9.00', isActive: false },
  {
    ...baseItem,
    id: 'pizza',
    name: 'Pizza',
    price: '50.00',
    isActive: true,
    modifiers: [
      {
        id: 'flavor',
        name: 'Sabor',
        description: null,
        role: 'COMPOSITION',
        minSelections: 1,
        maxSelections: 2,
        options: [],
      },
    ],
  },
]
