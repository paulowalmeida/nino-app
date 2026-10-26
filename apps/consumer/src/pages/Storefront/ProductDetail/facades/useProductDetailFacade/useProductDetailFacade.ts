import { useParams } from 'react-router'

import { useStore } from '@hooks/useStore/useStore'
import { useAddChosenProduct } from '@pages/Storefront/ProductDetail/hooks/useAddChosenProduct/useAddChosenProduct'
import { useMenuProduct } from '@pages/Storefront/ProductDetail/hooks/useMenuProduct/useMenuProduct'
import { useProductChoices } from '@pages/Storefront/ProductDetail/hooks/useProductChoices/useProductChoices'
import { useStorefrontSlug } from '@pages/Storefront/hooks/useStorefrontSlug/useStorefrontSlug'

export const useProductDetailFacade = () => {
  const { productId } = useParams()
  const slug = useStorefrontSlug()
  const storeQuery = useStore(slug)
  const unitId = storeQuery.store?.id
  const menuProduct = useMenuProduct(unitId, productId)
  const choices = useProductChoices(menuProduct.product)
  const command = useAddChosenProduct(menuProduct.product, unitId, slug)

  return {
    ...menuProduct,
    ...choices,
    ...command,
    slug,
    isStorePending: storeQuery.isPending,
  }
}

export type ProductDetailFacade = ReturnType<typeof useProductDetailFacade>
