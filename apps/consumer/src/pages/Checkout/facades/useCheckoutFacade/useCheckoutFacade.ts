import { useCheckoutCart } from '@pages/checkout/hooks/useCheckoutCart/useCheckoutCart'
import { useDeliveryZones } from '@pages/checkout/hooks/useDeliveryZones/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useCheckoutWorkflow } from '@pages/checkout/hooks/useCheckoutWorkflow/useCheckoutWorkflow'
import { useCheckoutResume } from '@pages/checkout/hooks/useCheckoutResume/useCheckoutResume'
import { useCheckoutStore } from '@pages/checkout/states/checkout/checkout.state'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'
import { isOpen } from '@utils/store-info'

export const useCheckoutFacadeValue = (pathSlug?: string | null) => {
  const slug = useCheckoutStore((state) => state.slug)
  const setSlug = useCheckoutStore((state) => state.setSlug)
  const storeQuery = useStore(slug)
  const { consumer } = useConsumerSession()
  const addressesQuery = useMyAddresses(consumer !== null)
  const settingsQuery = usePublicSettings(storeQuery.store?.id)
  const zonesQuery = useDeliveryZones(storeQuery.store?.id)
  const hoursQuery = useOpeningHours(storeQuery.store?.id)
  const cart = useCheckoutCart(storeQuery.store?.id)
  const { cartLines } = cart

  const checkout = useCheckoutWorkflow({
    store: storeQuery.store,
    consumer,
    addresses: addressesQuery.data ?? [],
    zones: zonesQuery.zones,
    isLoadingZones: zonesQuery.isPending,
    cartLines,
    estimatedMinutes: settingsQuery.estimatedMinutes,
    paymentOptions: settingsQuery.settings?.acceptedPaymentMethods,
    minimumOrderAmount: settingsQuery.settings?.minOrderAmount,
    clearCart: cart.clear,
    slug,
  })
  const lastOrder = useCheckoutResume(
    pathSlug ?? null,
    checkout.created,
    cartLines.length
  )

  return {
    store: storeQuery.store,
    isStorePending: storeQuery.isPending,
    zones: zonesQuery.zones,
    isHoursPending: hoursQuery.isPending,
    hours: hoursQuery.hours,
    cartLines,
    lastOrder,
    isStoreOpen:
      hoursQuery.isPending ||
      (storeQuery.store ? isOpen(storeQuery.store, hoursQuery.hours) : false),
    setSlug,
    ...checkout,
  }
}

export type CheckoutFacade = ReturnType<typeof useCheckoutFacadeValue>

export const useCheckoutFacade = (facade: CheckoutFacade | undefined) => {
  if (!facade) throw new Error('CheckoutFacade is required')
  return facade
}
