import type { MenuItem, MenuPage } from '@custom_types/product'

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
