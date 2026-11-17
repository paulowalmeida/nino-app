import { useEffect } from 'react'

import type { CartLine } from '@custom_types/cart/cart-line'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { useProductChoicesStore } from '@pages/Storefront/ProductDetail/states/product-choices/product-choices.state'
import { missingRequiredGroup } from '@pages/Storefront/ProductDetail/utils/missing-required-group/missing-required-group'
import { selectionsFromModifiers } from '@pages/Storefront/ProductDetail/utils/selections-from-modifiers/selections-from-modifiers'
import { productTotal } from '@pages/Storefront/ProductDetail/utils/product-total/product-total'

export const useProductChoices = (
  product: MenuItem | null,
  editingLine: CartLine | null = null
) => {
  const selections = useProductChoicesStore((state) => state.selections)
  const quantity = useProductChoicesStore((state) => state.quantity)
  const notes = useProductChoicesStore((state) => state.notes)
  const openProduct = useProductChoicesStore((state) => state.openProduct)
  const reset = useProductChoicesStore((state) => state.reset)
  const productId = product?.id
  const editingLineId = editingLine?.id

  useEffect(() => {
    if (!productId) return
    if (!product || !editingLine) return openProduct(productId)

    openProduct(productId, {
      lineId: editingLine.id,
      selections: selectionsFromModifiers(product, editingLine.item.modifiers),
      quantity: editingLine.quantity,
      notes: editingLine.item.notes ?? '',
    })
    // WHY: sair da edição sem confirmar não deixa rascunho para a próxima vez.
    return reset
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recomeça só quando muda o produto ou a linha, não a cada render da linha
  }, [productId, editingLineId, openProduct, reset])

  return {
    selections,
    quantity,
    notes,
    selectChoice: useProductChoicesStore((state) => state.selectChoice),
    toggleChoice: useProductChoicesStore((state) => state.toggleChoice),
    setQuantity: useProductChoicesStore((state) => state.setQuantity),
    setNotes: useProductChoicesStore((state) => state.setNotes),
    isEditing: editingLine !== null,
    missingGroup:
      product && quantity > 0
        ? missingRequiredGroup(product, selections)
        : null,
    total: product ? productTotal(product, selections, quantity) : 0,
  }
}
