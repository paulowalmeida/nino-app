import { useMenu } from '@pages/Storefront/hooks/useMenu/useMenu'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useIsDesktop } from '@pages/Storefront/hooks/useIsDesktop/useIsDesktop'
import { useMenuSections } from '@pages/Storefront/hooks/useMenuSections/useMenuSections'
import { useMenuItemAction } from '@pages/Storefront/hooks/useMenuItemAction/useMenuItemAction'
import { useStorefrontCart } from '@pages/Storefront/hooks/useStorefrontCart/useStorefrontCart'
import { useStorefrontSlug } from '@pages/Storefront/hooks/useStorefrontSlug/useStorefrontSlug'
import { useHomeInteractionStore } from '@pages/Storefront/states/storefront/storefront.state'
import { usePromotionOffers } from '@hooks/usePromotionOffers/usePromotionOffers'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useLogout } from '@shared/hooks/useLogout/useLogout'

export const useStorefrontFacade = (requestedSlug?: string) => {
  const routeSlug = useStorefrontSlug()
  const slug = requestedSlug ?? routeSlug
  const storeQuery = useStore(slug)
  const unitId = storeQuery.store?.id
  const menuQuery = useMenu(unitId)
  const hoursQuery = useOpeningHours(unitId)
  const settingsQuery = usePublicSettings(unitId)
  const cart = useStorefrontCart(unitId)
  const offers = usePromotionOffers(unitId)
  const menuItemAction = useMenuItemAction(unitId)
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
  const menuSections = useMenuSections(menuQuery.sections, search)
  const isDesktop = useIsDesktop()
  const { consumer, isPending: isConsumerPending } = useConsumerSession()
  const logout = useLogout()

  return {
    store: storeQuery.store,
    isStorePending: storeQuery.isPending,
    isStoreError: storeQuery.isError,
    isHeaderPending:
      storeQuery.isPending ||
      menuQuery.isPending ||
      hoursQuery.isPending ||
      settingsQuery.isPending ||
      isConsumerPending,
    sections: menuQuery.sections,
    isMenuPending: menuQuery.isPending,
    isMenuError: menuQuery.isError,
    retryMenu: menuQuery.refetch,
    hours: hoursQuery.hours,
    isHoursPending: hoursQuery.isPending,
    estimatedMinutes: settingsQuery.estimatedMinutes,
    showAddressOnStoreInfo:
      settingsQuery.settings?.showAddressOnStoreInfo ?? true,
    ...cart,
    freeDelivery: offers.freeDelivery,
    discountOffer: offers.discountOffers[0],
    giftOffer: offers.giftOffer,
    ...menuItemAction,
    ...menuSections,
    isDesktop,
    consumer,
    logout: logout.mutate,
    isLoggingOut: logout.isPending,
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
