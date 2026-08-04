import type { ProductCategory } from './product-category'

/** Categoria já cruzada com quantos itens do cardápio caem nela. */
export type CategoryWithCount = ProductCategory & {
  count: number
}
