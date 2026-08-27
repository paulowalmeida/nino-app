import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

export const productDetailValuesMock: ProductDetailFormValues = {
  name: 'X-Tudo',
  description: 'Com tudo dentro',
  price: '24,90',
  categoryId: 'category-1',
  position: 1,
  isActive: true,
}

export const productSubmissionMock = {
  tenantId: 'tenant-1',
  productId: 'product-1',
}
