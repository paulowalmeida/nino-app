import type { ReplaceProductModifierRequest } from '@shared/types/product/replace-product-modifier-request'

export const replaceProductModifiersContextMock = {
  unitId: 'unit-1',
  productId: 'product-1',
}

export const replaceProductModifiersRequestMock: ReplaceProductModifierRequest[] = [
  {
    name: 'Primeiro sabor',
    role: 'COMPOSITION',
    minSelections: 1,
    maxSelections: 1,
    options: [{ name: 'Queijo', price: 20 }],
  },
]
