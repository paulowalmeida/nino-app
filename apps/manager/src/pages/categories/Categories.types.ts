import type { ProductCategory } from '@custom_types/product'

/** Categoria já cruzada com quantos itens do cardápio caem nela. */
export type CategoryWithCount = ProductCategory & {
  count: number
}

export type CategoryRowProps = {
  category: CategoryWithCount
  index: number
  isRenaming: boolean
  onRename: (name: string) => Promise<void>
  onDelete: () => void
  onDragEnd: () => void
  disabled: boolean
}
