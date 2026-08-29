import type { MenuItem } from '@custom_types/menu/menu-item'

export const useCartSummaryMock: { menuItem: MenuItem } = {
  menuItem: {
    id: 'item-1',
    name: 'Hambúrguer',
    description: null,
    price: '25.5',
    isActive: true,
    category: { id: 'category-1', name: 'Lanches', position: 1 },
    images: [],
  },
}
