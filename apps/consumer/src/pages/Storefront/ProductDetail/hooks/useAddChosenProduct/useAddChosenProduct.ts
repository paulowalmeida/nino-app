import { useNavigate } from 'react-router'

import { toast } from '@nino/ds/components/Toast'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { useStorefrontCart } from '@pages/Storefront/hooks/useStorefrontCart/useStorefrontCart'
import { useProductChoicesStore } from '@pages/Storefront/ProductDetail/states/product-choices/product-choices.state'
import { chosenModifiers } from '@pages/Storefront/ProductDetail/utils/chosen-modifiers/chosen-modifiers'
import { resolveBackHref } from '@utils/resolve-back-href'

export const useAddChosenProduct = (
  product: MenuItem | null,
  tenantId: string | undefined,
  slug: string | undefined
) => {
  const navigate = useNavigate()
  const cart = useStorefrontCart(tenantId)
  const selections = useProductChoicesStore((state) => state.selections)
  const quantity = useProductChoicesStore((state) => state.quantity)
  const notes = useProductChoicesStore((state) => state.notes)
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

  const addToBag = () => {
    if (!product) return
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
