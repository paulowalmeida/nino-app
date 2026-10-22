import { useCheckoutCart } from '@pages/checkout/hooks/useCheckoutCart/useCheckoutCart'
import { useDeliveryZones } from '@pages/checkout/hooks/useDeliveryZones/useDeliveryZones'
import { useOpeningHours } from '@hooks/useOpeningHours/useOpeningHours'
import { usePromotionOffers } from '@hooks/usePromotionOffers/usePromotionOffers'
import { usePublicSettings } from '@hooks/usePublicSettings/usePublicSettings'
import { useStore } from '@hooks/useStore/useStore'
import { useCheckoutCoupon } from '@pages/checkout/hooks/useCheckoutCoupon/useCheckoutCoupon'
import { useCheckoutWorkflow } from '@pages/checkout/hooks/useCheckoutWorkflow/useCheckoutWorkflow'
import { useCheckoutResume } from '@pages/checkout/hooks/useCheckoutResume/useCheckoutResume'
import { useCheckoutStore } from '@pages/checkout/states/checkout/checkout.state'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useMyAddresses } from '@shared/hooks/useMyAddresses/useMyAddresses'
import { isOpen } from '@utils/store-info'
import { resolveSlug } from '@utils/resolve-slug'

export const useCheckoutFacadeValue = (pathSlug?: string | null) => {
  const storedSlug = useCheckoutStore((state) => state.slug)
  const setSlug = useCheckoutStore((state) => state.setSlug)
  // WHY: a rota/host é a fonte síncrona da loja. Esperar o effect de Checkout
  // popular o Zustand cria um frame em que a sacola parece vazia e pode
  // reabrir um pedido antigo antes de a loja atual terminar de carregar.
  const slug = resolveSlug(pathSlug ?? undefined) ?? storedSlug
  const storeQuery = useStore(slug)
  const { consumer } = useConsumerSession()
  const addressesQuery = useMyAddresses(consumer !== null)
  const settingsQuery = usePublicSettings(storeQuery.store?.id)
  const zonesQuery = useDeliveryZones(storeQuery.store?.id)
  const hoursQuery = useOpeningHours(storeQuery.store?.id)
  const cart = useCheckoutCart(storeQuery.store?.id)
  const offers = usePromotionOffers(storeQuery.store?.id)
  const couponState = useCheckoutCoupon(storeQuery.store?.id)
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
    freeDelivery: offers.freeDelivery,
    discountOffers: offers.discountOffers,
    coupon: couponState.coupon,
    refetchOffers: offers.refetchOffers,
  })
  const lastOrder = useCheckoutResume({
    pathSlug: pathSlug ?? null,
    storeSlug: slug,
    isStoreReady: !storeQuery.isPending && !!storeQuery.store,
    created: checkout.created,
    cartItemCount: cartLines.length,
  })

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
    couponSuggestions: offers.couponSuggestions,
    applyCouponCode: couponState.applyCouponCode,
    applyCoupon: couponState.applyCoupon,
    removeCoupon: couponState.removeCoupon,
    isApplyingCoupon: couponState.isApplyingCoupon,
    couponError: couponState.couponError,
    ...checkout,
  }
}

export type CheckoutFacade = ReturnType<typeof useCheckoutFacadeValue>

export const useCheckoutFacade = (facade: CheckoutFacade | undefined) => {
  if (!facade) throw new Error('CheckoutFacade is required')
  return facade
}
