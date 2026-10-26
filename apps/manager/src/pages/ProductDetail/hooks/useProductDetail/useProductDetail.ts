import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useProductCategoryOptions } from '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'
import type { MenuItem } from '@shared/types/product/menu-item'
import type { ProductCategoryOption } from '@shared/types/product/product-category-option'

type ProductDetail = {
  item: MenuItem | null
  categoryOptions: ProductCategoryOption[]
  isPending: boolean
  isMissing: boolean
  isReady: boolean
}

/* WHY: a ficha lê o item do cardápio já em cache em vez de GET /products/:id
 * pra evitar uma segunda chamada — o item já está carregado pra lista.
 * As categorias, porém, vêm direto da API: uma categoria recém-criada ainda
 * não tem produto, então não apareceria se derivada do cardápio. */
export const useProductDetail = (
  unitId: string | null,
  productId: string | undefined
): ProductDetail => {
  const { data, isPending } = useMenu(unitId)
  const { categoryOptions } = useProductCategoryOptions(unitId)
  const item = data?.data.find(({ id }) => id === productId) ?? null

  return {
    item,
    categoryOptions,
    isPending,
    isMissing: !isPending && item === null,
    isReady: !isPending && item !== null,
  }
}
