import { useEffect } from 'react'

import type { MenuItem } from '@custom_types/menu/menu-item'
import { useProductChoicesStore } from '@pages/Storefront/ProductDetail/states/product-choices/product-choices.state'
import { missingRequiredGroup } from '@pages/Storefront/ProductDetail/utils/missing-required-group/missing-required-group'
import { productTotal } from '@pages/Storefront/ProductDetail/utils/product-total/product-total'

export const useProductChoices = (product: MenuItem | null) => {
  const selections = useProductChoicesStore((state) => state.selections)
  const quantity = useProductChoicesStore((state) => state.quantity)
  const notes = useProductChoicesStore((state) => state.notes)
  const openProduct = useProductChoicesStore((state) => state.openProduct)
  const productId = product?.id

  useEffect(() => {
    if (productId) openProduct(productId)
  }, [productId, openProduct])

  return {
    selections,
    quantity,
    notes,
    selectChoice: useProductChoicesStore((state) => state.selectChoice),
    toggleChoice: useProductChoicesStore((state) => state.toggleChoice),
    setQuantity: useProductChoicesStore((state) => state.setQuantity),
    setNotes: useProductChoicesStore((state) => state.setNotes),
    missingGroup: product ? missingRequiredGroup(product, selections) : null,
    total: product ? productTotal(product, selections, quantity) : 0,
  }
}
