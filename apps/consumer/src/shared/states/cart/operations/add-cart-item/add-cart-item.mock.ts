import type { MenuItem } from '@custom_types/menu/menu-item'

export const addCartItemMock: { item: MenuItem } = {
  item: {
    id: 'item-1',
    name: 'Café',
    description: null,
    price: '5',
    isActive: true,
    category: { id: 'drinks', name: 'Bebidas', position: 1 },
    images: [],
  },
}
