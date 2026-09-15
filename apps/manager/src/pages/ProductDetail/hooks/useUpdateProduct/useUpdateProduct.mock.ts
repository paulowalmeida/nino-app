import type { UpdateMenuItemRequest } from '@shared/types/product/update-menu-item-request'

export const updateProductMock = {
  unitId: 'unit-1',
  productId: 'product-1',
}

export const updateProductRequestMock: UpdateMenuItemRequest = {
  name: 'X-Tudo',
  description: 'Com tudo dentro',
  price: 24.9,
  categoryId: 'category-1',
  position: 1,
  isActive: true,
}
