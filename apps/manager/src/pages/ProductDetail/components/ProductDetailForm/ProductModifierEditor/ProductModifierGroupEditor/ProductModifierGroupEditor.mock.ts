import type { ProductDetailFormValues } from '@pages/ProductDetail/types/ProductDetailFormValues.type'

export const productModifierGroupEditorFormMock: ProductDetailFormValues = {
  name: 'Pizza dois sabores',
  description: '',
  price: '0,00',
  pricingType: 'COMPOSED',
  categoryId: 'category-1',
  position: 1,
  isActive: true,
  requiresPreparation: true,
  modifiers: [
    {
      name: 'Primeiro sabor',
      description: '',
      role: 'COMPOSITION',
      minSelections: 1,
      maxSelections: 1,
      options: [{ name: 'Queijo', price: '20,00' }],
    },
  ],
}
