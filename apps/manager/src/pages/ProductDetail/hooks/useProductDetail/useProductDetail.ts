import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { ProductCategoryOption } from '@shared/types/product/product-category-option'

type ProductDetail = {
  item: MenuItem | null
  categoryOptions: ProductCategoryOption[]
  isPending: boolean
  isMissing: boolean
  isReady: boolean
}

/* WHY: a ficha lê o item do cardápio já em cache em vez de GET /products/:id,
 * que é OWNER-only — um MANAGER lista o cardápio mas não lê um item sozinho.
 * As categorias vêm da mesma lista pelo mesmo motivo. */
export const useProductDetail = (
  tenantId: string | null,
  productId: string | undefined
): ProductDetail => {
  const { data, sections, isPending } = useMenu(tenantId)
  const item = data?.data.find(({ id }) => id === productId) ?? null

  return {
    item,
    categoryOptions: sections.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
    isPending,
    isMissing: !isPending && item === null,
    isReady: !isPending && item !== null,
  }
}
