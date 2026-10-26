import type { CreateMenuItemRequest } from '@shared/types/product/create-menu-item-request'

export const createProductRequestMock: CreateMenuItemRequest = {
  name: 'X-Tudo',
  description: 'Com tudo dentro',
  price: 24.9,
  categoryId: 'category-1',
}

export const createdProductMock = {
  id: 'product-1',
  imageUploadFailed: false,
}
