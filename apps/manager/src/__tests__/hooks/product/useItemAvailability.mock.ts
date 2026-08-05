import type { MenuItem } from '@custom_types/product/menu-item'
import type { MenuPage } from '@custom_types/product/menu-page'
export const menuPage: MenuPage = {
  data: [
    { id: 'item-1', name: 'Pizza', isActive: true } as MenuItem,
    { id: 'item-2', name: 'Suco', isActive: true } as MenuItem,
  ],
  pagination: { total: 2 },
}

export const catalogPages = {
  pageParams: [1],
  pages: [
    {
      data: [{ id: 'item-1', name: 'Pizza', isActive: true } as MenuItem],
      pagination: { total: 1 },
    } as MenuPage,
  ],
}
