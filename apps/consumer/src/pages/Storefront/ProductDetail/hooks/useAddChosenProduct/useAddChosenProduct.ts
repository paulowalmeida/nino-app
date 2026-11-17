import { useNavigate } from 'react-router'

import { toast } from '@nino/ds/components/Toast'
import type { CartLine } from '@custom_types/cart/cart-line'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { useHomeInteractionStore } from '@pages/Storefront/states/storefront/storefront.state'
import { useStorefrontCart } from '@pages/Storefront/hooks/useStorefrontCart/useStorefrontCart'
import { useProductChoicesStore } from '@pages/Storefront/ProductDetail/states/product-choices/product-choices.state'
import { chosenModifiers } from '@pages/Storefront/ProductDetail/utils/chosen-modifiers/chosen-modifiers'
import { resolveBackHref } from '@utils/resolve-back-href'

export const useAddChosenProduct = (
  product: MenuItem | null,
  unitId: string | undefined,
  slug: string | undefined,
  editingLine: CartLine | null = null
) => {
  const navigate = useNavigate()
  const cart = useStorefrontCart(unitId)
  const selections = useProductChoicesStore((state) => state.selections)
  const quantity = useProductChoicesStore((state) => state.quantity)
  const notes = useProductChoicesStore((state) => state.notes)
  const setCartOpen = useHomeInteractionStore((state) => state.setCartOpen)
  const reset = useProductChoicesStore((state) => state.reset)
  const askReplacement = useProductChoicesStore((state) => state.askReplacement)
  const isReplacementPending = useProductChoicesStore(
    (state) => state.isReplacementPending
  )
  const dismissReplacement = useProductChoicesStore(
    (state) => state.dismissReplacement
  )

  const backToMenu = () => {
    toast.success('Adicionado à sacola.')
    reset()
    navigate(resolveBackHref(slug))
  }

  const updateBag = (line: CartLine, item: MenuItem) => {
    const choices = {
      modifiers: chosenModifiers(item, selections),
      notes: notes.trim(),
    }
    if (!cart.updateCartLine(line.id, item, quantity, choices)) return
    toast.success(quantity > 0 ? 'Sacola atualizada.' : 'Item removido.')
    reset()
    // WHY: quem veio da sacola volta para ela, já com a linha atualizada.
    setCartOpen(quantity > 0 || cart.cartLines.length > 1)
    navigate(resolveBackHref(slug))
  }

  const addToBag = () => {
    if (!product) return
    if (editingLine) return updateBag(editingLine, product)
    const choices = {
      modifiers: chosenModifiers(product, selections),
      notes: notes.trim(),
    }
    if (cart.addToCart(product, quantity, choices)) return backToMenu()

    askReplacement()
  }

  const replaceBag = () => {
    if (!product) return
    cart.replaceCart(product, quantity, {
      modifiers: chosenModifiers(product, selections),
      notes: notes.trim(),
    })
    backToMenu()
  }

  return { addToBag, replaceBag, isReplacementPending, dismissReplacement }
}
