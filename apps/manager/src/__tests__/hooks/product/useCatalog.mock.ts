import type { MenuItem, MenuPage } from '@custom_types/product'

const category = { id: 'cat-1', name: 'Lanches', position: 1 }

export const itemA: MenuItem = {
  id: 'a',
  name: 'Item A',
  description: null,
  price: '10.00',
  position: 1,
  isActive: true,
  category,
  images: [],
}

export const itemB: MenuItem = { ...itemA, id: 'b', name: 'Item B' }
export const itemC: MenuItem = { ...itemA, id: 'c', name: 'Item C' }

export const fullFirstPage: MenuPage = {
  data: [itemA, itemB],
  pagination: { total: 3 },
}

export const lastPage: MenuPage = {
  data: [itemC],
  pagination: { total: 3 },
}
