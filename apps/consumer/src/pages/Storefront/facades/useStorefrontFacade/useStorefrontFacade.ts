import { useCartSummary } from '@hooks/useCartSummary/useCartSummary'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { cartItem } from '@pages/Storefront/adapters/cartItem.adapter/cartItem.adapter'
import { useMenu } from '@pages/Storefront/hooks/useMenu/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useHomeInteractionStore } from '@pages/Storefront/states/storefront/storefront.state'

export const useStorefrontFacade = (slug: string | undefined) => {
  const storeQuery = useStore(slug)
  const tenantId = storeQuery.store?.id
  const menuQuery = useMenu(tenantId)
  const hoursQuery = useOpeningHours(tenantId)
  const settingsQuery = usePublicSettings(tenantId)
  const cart = useCartSummary()
  const ownsCart = !cart.tenantId || cart.tenantId === tenantId
  const cartLines = ownsCart ? cart.cartLines : []
  const cartLinesById = ownsCart ? cart.lines : {}
  const cartCount = ownsCart ? cart.count : 0
  const cartTotal = ownsCart ? cart.total : 0

  const addToCart = (item: MenuItem, quantity = 1) =>
    tenantId ? cart.add(tenantId, cartItem(item), quantity) : false

  const replaceCart = (item: MenuItem, quantity = 1) => {
    if (tenantId) cart.replace(tenantId, cartItem(item), quantity)
  }
  const search = useHomeInteractionStore((state) => state.search)
  const setSearch = useHomeInteractionStore((state) => state.setSearch)
  const isCartOpen = useHomeInteractionStore((state) => state.isCartOpen)
  const setCartOpen = useHomeInteractionStore((state) => state.setCartOpen)
  const isInfoOpen = useHomeInteractionStore((state) => state.isInfoOpen)
  const setInfoOpen = useHomeInteractionStore((state) => state.setInfoOpen)
  const selectedItem = useHomeInteractionStore((state) => state.selectedItem)
  const setSelectedItem = useHomeInteractionStore(
    (state) => state.setSelectedItem
  )

  return {
    store: storeQuery.store,
    isStorePending: storeQuery.isPending,
    isStoreError: storeQuery.isError,
    sections: menuQuery.sections,
    isMenuPending: menuQuery.isPending,
    isMenuError: menuQuery.isError,
    retryMenu: menuQuery.refetch,
    hours: hoursQuery.hours,
    isHoursPending: hoursQuery.isPending,
    estimatedMinutes: settingsQuery.estimatedMinutes,
    cart: cartLinesById,
    cartLines,
    cartCount,
    cartTotal,
    addToCart,
    replaceCart,
    incrementCartLine: cart.increment,
    decrementCartLine: cart.decrement,
    clearCart: cart.clear,
    search,
    setSearch,
    isCartOpen,
    setCartOpen,
    isInfoOpen,
    setInfoOpen,
    selectedItem,
    setSelectedItem,
    reset: useHomeInteractionStore((state) => state.reset),
  }
}

export type StorefrontFacade = ReturnType<typeof useStorefrontFacade>
