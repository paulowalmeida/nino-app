import type { CreateMenuItemRequest, MenuItem } from '@custom_types/product'

export const newItemRequest: CreateMenuItemRequest = {
  name: 'Pizza Marguerita',
  price: 42.9,
  categoryId: 'cat-a',
}

export const createdItem: MenuItem = {
  id: 'item-1',
  name: 'Pizza Marguerita',
  description: null,
  price: '42.90',
  position: 1,
  isActive: true,
  category: { id: 'cat-a', name: 'Lanches', position: 1 },
  images: [],
}
