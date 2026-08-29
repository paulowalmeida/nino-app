import { useCartSummary } from '@hooks/useCartSummary/useCartSummary'
import { useDeliveryZones } from '@pages/checkout/hooks/useDeliveryZones/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useGuestCheckout } from '@pages/checkout/hooks/useGuestCheckout/useGuestCheckout'
import { useCheckoutStore } from '@pages/checkout/states/checkout/checkout.state'

export const useCheckoutFacade = () => {
  const slug = useCheckoutStore((state) => state.slug)
  const setSlug = useCheckoutStore((state) => state.setSlug)
  const storeQuery = useStore(slug)
  const settingsQuery = usePublicSettings(storeQuery.store?.id)
  const zonesQuery = useDeliveryZones(storeQuery.store?.id)
  const hoursQuery = useOpeningHours(storeQuery.store?.id)
  const cart = useCartSummary()

  const checkout = useGuestCheckout({
    store: storeQuery.store,
    zones: zonesQuery.zones,
    isLoadingZones: zonesQuery.isPending,
    cartLines: cart.cartLines,
    estimatedMinutes: settingsQuery.estimatedMinutes,
    paymentOptions: settingsQuery.settings?.acceptedPaymentMethods ?? ['CASH'],
    clearCart: cart.clear,
    slug,
  })

  return {
    store: storeQuery.store,
    isStorePending: storeQuery.isPending,
    zones: zonesQuery.zones,
    isHoursPending: hoursQuery.isPending,
    hours: hoursQuery.hours,
    cartLines: cart.cartLines,
    setSlug,
    ...checkout,
  }
}

export type CheckoutFacade = ReturnType<typeof useCheckoutFacade>
