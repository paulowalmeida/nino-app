import type { MenuItem } from '@shared/types/product/menu-item'
import type { MenuSection } from '@shared/types/product/menu-section'

export const menuItemMock: MenuItem = {
  id: 'product-1',
  name: 'X-Tudo',
  description: 'Com tudo dentro',
  price: '24.90',
  position: 1,
  isActive: true,
  category: { id: 'category-1', name: 'Lanches', position: 1 },
  images: [],
}

export const menuSectionsMock: MenuSection[] = [
  { id: 'category-1', name: 'Lanches', position: 1, items: [menuItemMock] },
  { id: 'category-2', name: 'Bebidas', position: 2, items: [] },
]

export const productDetailMock = {
  tenantId: 'tenant-1',
  productId: 'product-1',
  unknownProductId: 'product-404',
}
