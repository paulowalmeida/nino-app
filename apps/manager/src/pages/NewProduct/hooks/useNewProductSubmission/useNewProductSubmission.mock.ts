import type { NewProductFormValues } from '@pages/NewProduct/types/NewProductFormValues.type'

export const newProductValuesMock: NewProductFormValues = {
  name: 'X-Tudo',
  description: 'Com tudo dentro',
  price: '24,90',
  categoryId: 'category-1',
}

export const createdProductMock = { id: 'product-1', imageUploadFailed: false }

export const createdWithoutPhotoMock = {
  id: 'product-1',
  imageUploadFailed: true,
}
