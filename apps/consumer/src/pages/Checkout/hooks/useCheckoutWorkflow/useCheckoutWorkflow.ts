import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import type { Address } from '@custom_types/address/address'
import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import type { Consumer } from '@custom_types/consumer/consumer'
import type { PublicDeliveryZone } from '@pages/checkout/types/delivery-zone/PublicDeliveryZone.type'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import type { Store } from '@custom_types/store/store'
import { checkoutTotals } from '@pages/checkout/utils/checkout-totals/checkout-totals'
import { orderOffers } from '@pages/checkout/utils/order-offers/order-offers'
import { promotionUnavailableFee } from '@pages/checkout/utils/promotion-unavailable/promotion-unavailable'
import { discountAmount } from '@utils/discount/discount'
import { useDeliveryQuote } from '@pages/checkout/hooks/useDeliveryQuote/useDeliveryQuote'
import { usePlaceOrder } from '@pages/checkout/hooks/usePlaceOrder/usePlaceOrder'
import { writeLastOrder } from '@utils/last-order'
import { ApiError } from '@nino/lib/utils/api-error'

type UseCheckoutWorkflowParams = {
  store: Store | undefined
  consumer: Consumer | null
  addresses: Address[]
  zones: PublicDeliveryZone[]
  isLoadingZones: boolean
  cartLines: CartLine[]
  estimatedMinutes: number | undefined
  paymentOptions: PaymentMethod[] | undefined
  minimumOrderAmount?: number | undefined
  clearCart: () => void
  slug: string | undefined
  freeDelivery?: PublicPromotion
  discountOffers?: PublicPromotion[]
  coupon?: PublicPromotion
  refetchOffers?: () => unknown
}

/** WHY: concentra o formulário, a cotação e a criação em uma única instância. */
export const useCheckoutWorkflow = ({
  store,
  consumer,
  addresses,
  zones,
  isLoadingZones,
  cartLines,
  estimatedMinutes,
  paymentOptions: configuredPaymentOptions,
  minimumOrderAmount,
  clearCart,
  slug,
  freeDelivery,
  discountOffers = [],
  coupon,
  refetchOffers,
}: UseCheckoutWorkflowParams) => {
  const isAuthenticated = consumer !== null
  const paymentOptions = configuredPaymentOptions ?? ['CASH']
  const form = useForm<CheckoutFormValues>({
    defaultValues: { channel: 'DELIVERY', paymentMethod: 'CASH' },
  })
  const {
    mutate: createOrder,
    isPending: isSubmitting,
    isError: submitFailed,
    error: submitError,
    data: created,
  } = usePlaceOrder(isAuthenticated)

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form

  const channel = useWatch({ control, name: 'channel' })
  const paymentMethod = useWatch({ control, name: 'paymentMethod' })
  const deliveryZoneId = useWatch({ control, name: 'deliveryZoneId' })
  const deliveryAddressId = useWatch({ control, name: 'deliveryAddressId' })
  const guestZipCode = useWatch({ control, name: 'guestZipCode' })
  const guestProviderId = useWatch({ control, name: 'guestProviderId' })
  const guestLatitude = useWatch({ control, name: 'guestLatitude' })
  const guestLongitude = useWatch({ control, name: 'guestLongitude' })
  const selectedAddress = addresses.find(({ id }) => id === deliveryAddressId)
  const { quote, isFetching: isQuoting } = useDeliveryQuote(
    store?.id,
    isAuthenticated
      ? (selectedAddress ?? {})
      : {
          providerId: guestProviderId,
          zipCode: guestZipCode,
          latitude: guestLatitude,
          longitude: guestLongitude,
        }
  )

  useEffect(() => {
    if (isAuthenticated && !deliveryAddressId && addresses[0]) {
      setValue('deliveryAddressId', addresses[0].id)
    }
  }, [addresses, deliveryAddressId, isAuthenticated, setValue])

  useEffect(() => {
    if (!consumer) return
    setValue('guestName', consumer.name)
    setValue('guestPhone', consumer.phone ?? '')
  }, [consumer, setValue])

  useEffect(() => {
    setValue('deliveryZoneId', quote?.id)
  }, [quote?.id, setValue])

  /** WHY: loja sem zona de entrega deve iniciar em retirada. */
  useEffect(() => {
    if (!isLoadingZones && zones.length === 0) setValue('channel', 'PICKUP')
  }, [isLoadingZones, zones.length, setValue])

  /**
   * WHY: a sacola só esvazia depois que a confirmação existe. Limpar junto com o
   * envio faz a tela de sacola vazia piscar no intervalo entre o carrinho
   * (store externa) e o `created` (estado da mutation) se atualizarem.
   */
  useEffect(() => {
    if (created) clearCart()
  }, [created, clearCart])

  const isDelivery = channel === 'DELIVERY'
  const zone = zones.find(({ id }) => id === deliveryZoneId) ?? quote
  /* WHY: depois do 409 a campanha não vale mais para este pedido, mesmo que a
   * vitrine ainda não tenha recarregado a lista de campanhas. */
  const [promotionEndedFee, setPromotionEndedFee] = useState<number | null>(
    null
  )

  const offers = orderOffers({
    freeDelivery,
    discountOffers,
    coupon,
    hasPromotionEnded: promotionEndedFee !== null,
  })
  const {
    subtotal,
    deliveryFee,
    deliveryDiscount,
    freeDeliveryCoverage,
    promotionDiscount,
    appliedDiscount,
    total,
    deliveryNote,
  } = checkoutTotals({
    cartLines,
    isDelivery,
    zone,
    estimatedMinutes,
    ...offers,
  })
  /* WHY: cupom fora da condição (mínimo, zona) faria a API recusar o pedido;
   * ele só vai no pedido quando já vale. */
  const isCouponEligible =
    !!coupon &&
    promotionEndedFee === null &&
    (coupon.type === 'FREE_DELIVERY'
      ? freeDeliveryCoverage === 'applied'
      : discountAmount(coupon, subtotal) > 0)
  const minimum = minimumOrderAmount ?? 0
  const isBelowMinimum = minimum > 0 && subtotal < minimum

  const onSubmit = (values: CheckoutFormValues) => {
    if (!store || isBelowMinimum) return

    createOrder(
      {
        values,
        store,
        cartLines,
        promotions: {
          couponCode: isCouponEligible ? coupon?.code ?? undefined : undefined,
          expectsFreeDelivery: freeDeliveryCoverage === 'applied',
          expectsDiscount: promotionDiscount > 0,
        },
      },
      {
        onError: (error) => {
          const fee = promotionUnavailableFee(error)
          if (fee === null) return
          setPromotionEndedFee(fee)
          void refetchOffers?.()
        },
        onSuccess: (order) => {
          if (!order.trackingToken) return
          writeLastOrder({
            orderId: order.id,
            token: order.trackingToken,
            slug: slug ?? '',
          })
        },
      }
    )
  }

  return {
    form,
    register,
    control,
    errors,
    onSubmit,
    isDelivery,
    isAuthenticated,
    consumer,
    addresses,
    paymentMethod,
    paymentOptions,
    zone,
    subtotal,
    deliveryFee,
    deliveryDiscount,
    freeDeliveryCoverage,
    promotionDiscount,
    appliedDiscount,
    coupon,
    isCouponEligible,
    total,
    deliveryNote,
    promotionEndedFee:
      submitFailed && promotionUnavailableFee(submitError) !== null
        ? promotionEndedFee
        : null,
    created,
    isSubmitting,
    submitFailed,
    submitErrorMessage:
      submitError instanceof ApiError && submitError.status === 429
        ? 'Muitas tentativas em pouco tempo. Aguarde alguns segundos e tente novamente.'
        : submitError instanceof Error
          ? submitError.message
          : undefined,
    isQuoting,
    minimumOrderAmount: minimum,
    isBelowMinimum,
  }
}
