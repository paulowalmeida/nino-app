import { useCartSummary } from '@hooks/useCartSummary'
import { useMenu } from '@pages/Home/hooks/useMenu/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'
import { useHomeInteractionStore } from '@pages/Home/states/home/home.state'

export const useHomeFacade = (slug: string | undefined) => {
  const storeQuery = useStore(slug)
  const tenantId = storeQuery.store?.id
  const menuQuery = useMenu(tenantId)
  const hoursQuery = useOpeningHours(tenantId)
  const settingsQuery = usePublicSettings(tenantId)
  const cart = useCartSummary()
  const search = useHomeInteractionStore((state) => state.search)
  const setSearch = useHomeInteractionStore((state) => state.setSearch)
  const isCartOpen = useHomeInteractionStore((state) => state.isCartOpen)
  const setCartOpen = useHomeInteractionStore((state) => state.setCartOpen)
  const isInfoOpen = useHomeInteractionStore((state) => state.isInfoOpen)
  const setInfoOpen = useHomeInteractionStore((state) => state.setInfoOpen)
  const selectedItem = useHomeInteractionStore((state) => state.selectedItem)
  const setSelectedItem = useHomeInteractionStore((state) => state.setSelectedItem)

  return {
    store: storeQuery.store,
    isStorePending: storeQuery.isPending,
    isStoreError: storeQuery.isError,
    sections: menuQuery.sections,
    isMenuPending: menuQuery.isPending,
    hours: hoursQuery.hours,
    isHoursPending: hoursQuery.isPending,
    estimatedMinutes: settingsQuery.settings?.estimatedMinutes,
    cart: cart.lines,
    cartLines: cart.cartLines,
    cartCount: cart.count,
    cartTotal: cart.total,
    addToCart: cart.add,
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
  }
}

export type HomeFacade = ReturnType<typeof useHomeFacade>
