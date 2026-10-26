import type { MenuItem } from '@shared/types/product/menu-item'
import type { ProductCategoryOption } from '@shared/types/product/product-category-option'

export const menuItemMock: MenuItem = {
  id: 'product-1',
  name: 'X-Tudo',
  description: 'Com tudo dentro',
  price: '24.90',
  position: 1,
  isActive: true,
  requiresPreparation: true,
  category: { id: 'category-1', name: 'Lanches', position: 1 },
  images: [],
  fallbackUrl: '/product-presets/x-tudo.png',
}

export const categoryOptionsMock: ProductCategoryOption[] = [
  { value: 'category-1', label: 'Lanches' },
  { value: 'category-2', label: 'Bebidas' },
]

export const productDetailMock = {
  unitId: 'unit-1',
  productId: 'product-1',
  unknownProductId: 'product-404',
}
