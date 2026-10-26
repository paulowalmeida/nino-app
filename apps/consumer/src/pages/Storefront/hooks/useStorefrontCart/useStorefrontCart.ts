import type { MenuItem } from '@custom_types/menu/menu-item'
import type { ProductChoices } from '@pages/Storefront/types/ProductChoices.type'
import { cartItem } from '@pages/Storefront/adapters/cartItem.adapter/cartItem.adapter'
import { useCartSummary } from '@shared/hooks/useCartSummary/useCartSummary'
import { quantityByProduct } from '@utils/quantity-by-product/quantity-by-product'
import { useCartStore } from '@shared/states/cart/cart.state'

export const useStorefrontCart = (unitId: string | undefined) => {
  const cart = useCartSummary()
  const setPackage = useCartStore((state) => state.setPackage)
  const ownsCart = !cart.unitId || cart.unitId === unitId

  const addToCart = (item: MenuItem, quantity = 1, choices?: ProductChoices) =>
    unitId ? cart.add(unitId, cartItem(item, choices), quantity) : false

  const replaceCart = (
    item: MenuItem,
    quantity = 1,
    choices?: ProductChoices
  ) => {
    if (unitId) cart.replace(unitId, cartItem(item, choices), quantity)
  }

  const addPackageToCart = (item: Parameters<typeof setPackage>[1]) =>
    unitId ? setPackage(unitId, item) : false

  return {
    cart: ownsCart ? cart.lines : {},
    quantityByProduct: quantityByProduct(ownsCart ? cart.cartLines : []),
    cartLines: ownsCart ? cart.cartLines : [],
    cartCount: ownsCart ? cart.count : 0,
    cartTotal: ownsCart ? cart.total : 0,
    addToCart,
    replaceCart,
    addPackageToCart,
    incrementCartLine: cart.increment,
    decrementCartLine: cart.decrement,
    clearCart: cart.clear,
  }
}
