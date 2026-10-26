import type { ProductCategory } from '@shared/types/product/product-category'

export const categoryPageMock = {
  data: [
    { id: 'category-2', name: 'Bebidas', position: 2 },
    { id: 'category-1', name: 'Lanches', position: 1 },
  ] as unknown as ProductCategory[],
}
