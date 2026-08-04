import type { MenuItem, MenuPage } from '@custom_types/product'

const pizza: MenuItem = {
  id: 'item-1',
  name: 'Pizza',
  description: null,
  price: '42.90',
  position: 1,
  isActive: true,
  category: { id: 'cat-a', name: 'Lanches', position: 1 },
  images: [],
}

export const menuWithPizza: MenuPage = {
  data: [pizza],
  pagination: { total: 1 },
}
