import type { MenuItem, UpdateMenuItemRequest } from '@custom_types/product'

export const updateRequest: UpdateMenuItemRequest = {
  name: 'Burger',
  price: 25,
  categoryId: 'cat-a',
  position: 1,
  isActive: true,
}

export const updatedItem: MenuItem = {
  id: 'item-1',
  name: 'Burger',
  description: null,
  price: '25.00',
  position: 1,
  isActive: true,
  category: { id: 'cat-a', name: 'Lanches', position: 1 },
  images: [],
}
