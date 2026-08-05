import type { MenuSection } from '@custom_types/product/menu-section'
const category = { id: 'cat-1', name: 'Bebidas', position: 0 }

export const sections: MenuSection[] = [
  {
    id: 'cat-1',
    name: 'Bebidas',
    position: 0,
    items: [
      {
        id: 'item-1',
        name: 'Coca-Cola',
        description: 'Lata 350ml',
        price: '6.5',
        position: 0,
        isActive: true,
        category,
        images: [],
      },
      {
        id: 'item-2',
        name: 'Guaraná',
        description: null,
        price: '6',
        position: 1,
        isActive: false,
        category,
        images: [],
      },
    ],
  },
  {
    id: 'cat-2',
    name: 'Lanches',
    position: 1,
    items: [
      {
        id: 'item-3',
        name: 'X-Salada',
        description: 'Com bacon',
        price: '18',
        position: 0,
        isActive: true,
        category: { id: 'cat-2', name: 'Lanches', position: 1 },
        images: [],
      },
    ],
  },
]
