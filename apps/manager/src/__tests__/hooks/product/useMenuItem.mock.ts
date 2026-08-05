import type { MenuItem } from '@custom_types/product/menu-item'
import type { MenuPage } from '@custom_types/product/menu-page'
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
