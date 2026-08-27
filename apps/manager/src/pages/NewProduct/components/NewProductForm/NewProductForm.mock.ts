import type { ProductCategoryOption } from '@shared/types/product/product-category-option'

export const categoryOptionsMock: ProductCategoryOption[] = [
  { value: 'category-1', label: 'Lanches' },
  { value: 'category-2', label: 'Bebidas' },
]

export const newProductFormMock = {
  nameLabel: 'Nome',
  submitLabel: 'Cadastrar item',
  cancelLabel: 'Cancelar',
  typedName: 'X-Tudo',
  typedPrice: '24,90',
  submitError: 'Não foi possível cadastrar. Confira os campos e tente de novo.',
}
