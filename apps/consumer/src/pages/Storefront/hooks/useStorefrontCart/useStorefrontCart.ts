import type { MenuItem } from '@custom_types/menu/menu-item'
import { cartItem } from '@pages/Storefront/adapters/cartItem.adapter/cartItem.adapter'
import { useCartSummary } from '@shared/hooks/useCartSummary/useCartSummary'

export const useStorefrontCart = (tenantId: string | undefined) => {
  const cart = useCartSummary()
  const ownsCart = !cart.tenantId || cart.tenantId === tenantId

  const addToCart = (item: MenuItem, quantity = 1) =>
    tenantId ? cart.add(tenantId, cartItem(item), quantity) : false

  const replaceCart = (item: MenuItem, quantity = 1) => {
    if (tenantId) cart.replace(tenantId, cartItem(item), quantity)
  }

  return {
    cart: ownsCart ? cart.lines : {},
    cartLines: ownsCart ? cart.cartLines : [],
    cartCount: ownsCart ? cart.count : 0,
    cartTotal: ownsCart ? cart.total : 0,
    addToCart,
    replaceCart,
    incrementCartLine: cart.increment,
    decrementCartLine: cart.decrement,
    clearCart: cart.clear,
  }
}
