import { useCartSummary } from '@hooks/useCartSummary/useCartSummary'
import { useDeliveryZones } from '@pages/checkout/hooks/useDeliveryZones/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useCheckoutWorkflow } from '@pages/checkout/hooks/useCheckoutWorkflow/useCheckoutWorkflow'
import { useCheckoutStore } from '@pages/checkout/states/checkout/checkout.state'
import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'

export const useCheckoutFacade = () => {
  const slug = useCheckoutStore((state) => state.slug)
  const setSlug = useCheckoutStore((state) => state.setSlug)
  const storeQuery = useStore(slug)
  const { customer } = useCustomerSession()
  const addressesQuery = useMyAddresses(customer !== null)
  const settingsQuery = usePublicSettings(storeQuery.store?.id)
  const zonesQuery = useDeliveryZones(storeQuery.store?.id)
  const hoursQuery = useOpeningHours(storeQuery.store?.id)
  const cart = useCartSummary()
  const ownsCart = cart.tenantId === storeQuery.store?.id
  const cartLines = ownsCart ? cart.cartLines : []

  const checkout = useCheckoutWorkflow({
    store: storeQuery.store,
    customer,
    addresses: addressesQuery.data ?? [],
    zones: zonesQuery.zones,
    isLoadingZones: zonesQuery.isPending,
    cartLines,
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
    cartLines,
    setSlug,
    ...checkout,
  }
}

export type CheckoutFacade = ReturnType<typeof useCheckoutFacade>
