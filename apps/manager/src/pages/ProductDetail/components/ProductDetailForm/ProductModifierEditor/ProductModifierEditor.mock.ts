import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

export const productModifierEditorFormMock: ProductDetailFormValues = {
  name: 'Prato montado',
  description: '',
  price: '0,00',
  pricingType: 'COMPOSED',
  categoryId: 'category-1',
  position: 1,
  isActive: true,
  requiresPreparation: true,
  modifiers: [],
}
