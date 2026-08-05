import type { MenuItem } from '@custom_types/product/menu-item'
import type { MenuPage } from '@custom_types/product/menu-page'
const lanches = { id: 'cat-a', name: 'Lanches', position: 2 }
const bebidas = { id: 'cat-b', name: 'Bebidas', position: 1 }

const burger: MenuItem = {
  id: 'item-1',
  name: 'Burger',
  description: null,
  price: '20.00',
  position: 1,
  isActive: true,
  category: lanches,
  images: [],
}

const cola: MenuItem = {
  id: 'item-2',
  name: 'Cola',
  description: null,
  price: '8.00',
  position: 1,
  isActive: true,
  category: bebidas,
  images: [],
}

export const menuPage: MenuPage = {
  data: [burger, cola],
  pagination: { total: 2 },
}

export const emptyMenuPage: MenuPage = {
  data: [],
  pagination: { total: 0 },
}
