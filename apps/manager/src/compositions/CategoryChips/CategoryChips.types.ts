import type { ProductCategory } from '@custom_types/product'

export type CategoryChipsProps = {
  categories: ProductCategory[]
  /** `null` é "Todas" — o cardápio inteiro, sem recorte. */
  value: string | null
  onChange: (categoryId: string | null) => void
}
