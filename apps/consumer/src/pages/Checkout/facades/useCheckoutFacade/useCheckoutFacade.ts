import { useCartSummary } from '@hooks/useCartSummary'
import { useDeliveryZones } from '@hooks/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings'
import { useStore } from '@hooks/useStore'
import { useGuestCheckout } from '@pages/checkout/hooks/useGuestCheckout/useGuestCheckout'
import { useCheckoutStore } from '@pages/checkout/states/checkout/checkout.state'

export const useCheckoutFacade = () => {
  const slug = useCheckoutStore((state) => state.slug)
  const setSlug = useCheckoutStore((state) => state.setSlug)
  const storeQuery = useStore(slug)
  const { settings } = usePublicSettings(storeQuery.store?.id)
  const zonesQuery = useDeliveryZones(storeQuery.store?.id)
  const hoursQuery = useOpeningHours(storeQuery.store?.id)
  const cart = useCartSummary()

  const checkout = useGuestCheckout({
    store: storeQuery.store,
    zones: zonesQuery.zones,
    isLoadingZones: zonesQuery.isPending,
    cartLines: cart.cartLines,
    estimatedMinutes: settings?.estimatedMinutes,
    paymentOptions: settings?.acceptedPaymentMethods ?? ['CASH'],
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
