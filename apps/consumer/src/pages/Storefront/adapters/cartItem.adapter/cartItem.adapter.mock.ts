import type { MenuItem } from '@custom_types/menu/menu-item'

export const cartItemAdapterMock: { item: MenuItem } = {
  item: {
    id: 'item-1',
    name: 'Café',
    description: 'Café coado',
    price: '5',
    isActive: true,
    category: { id: 'drinks', name: 'Bebidas', position: 1 },
    images: [
      {
        id: 'image-1',
        url: 'https://example.com/cafe.jpg',
        isPrimary: true,
      },
    ],
    modifiers: [],
  },
}
