import type { MenuItem } from '@shared/types/product/menu-item'

export const item: MenuItem = {
  id: 'item-1',
  name: 'Coxinha',
  description: null,
  price: '8.50',
  position: 1,
  isActive: true,
  category: { id: 'cat-1', name: 'Salgados', position: 0 },
  images: [],
}

export const secondItem: MenuItem = {
  ...item,
  id: 'item-2',
  name: 'Pastel',
}
