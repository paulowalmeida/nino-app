import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/public-delivery-zone'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { Store } from '@custom_types/store/store'
import { guestOrderRequest } from '@adapters/guestOrderRequest.adapter'
import { useCheckoutTotals } from '@hooks/useCheckoutTotals'
import { useCreateGuestOrder } from '@hooks/useCreateGuestOrder'
import { useDeliveryQuote } from '@hooks/useDeliveryQuote'
import { writeLastOrder } from '@utils/last-order'

type UseGuestCheckoutParams = {
  store: Store | undefined
  zones: PublicDeliveryZone[]
  isLoadingZones: boolean
  cartLines: CartLine[]
  estimatedMinutes: number | undefined
  paymentOptions: PaymentMethod[]
  clearCart: () => void
  slug: string | undefined
}

/** Formulário do pedido e o cálculo do que ele custa — a página só orquestra
    qual tela mostrar com o que este hook devolve. */
export const useGuestCheckout = ({
  store,
  zones,
  isLoadingZones,
  cartLines,
  estimatedMinutes,
  paymentOptions,
  clearCart,
  slug,
}: UseGuestCheckoutParams) => {
  const {
    mutate: createOrder,
    isPending: isSubmitting,
    isError: submitFailed,
    data: created,
  } = useCreateGuestOrder()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: { channel: 'DELIVERY', paymentMethod: 'CASH' },
  })

  const channel = useWatch({ control, name: 'channel' })
  const paymentMethod = useWatch({ control, name: 'paymentMethod' })
  const deliveryZoneId = useWatch({ control, name: 'deliveryZoneId' })
  const guestZipCode = useWatch({ control, name: 'guestZipCode' })
  const { quote, isFetching: isQuoting } = useDeliveryQuote(
    store?.id,
    guestZipCode
  )

  useEffect(() => {
    setValue('deliveryZoneId', quote?.id)
  }, [quote?.id, setValue])

  /** Loja que não entrega não pode ficar com "Entrega" marcado por padrão. */
  useEffect(() => {
    if (!isLoadingZones && zones.length === 0) setValue('channel', 'PICKUP')
  }, [isLoadingZones, zones.length, setValue])

  /**
   * A sacola só esvazia depois que a confirmação existe. Limpar junto com o
   * envio faz a tela de sacola vazia piscar no intervalo entre o carrinho
   * (store externa) e o `created` (estado da mutation) se atualizarem.
   */
  useEffect(() => {
    if (created) clearCart()
  }, [created, clearCart])

  const isDelivery = channel === 'DELIVERY'
  const zone = zones.find(({ id }) => id === deliveryZoneId) ?? quote

  const { subtotal, deliveryFee, total, deliveryNote } = useCheckoutTotals({
    cartLines,
    isDelivery,
    zone,
    estimatedMinutes,
  })

  const submit = handleSubmit((values) => {
    if (!store) return

    const payload = guestOrderRequest(values, store, cartLines)
    createOrder(payload, {
      onSuccess: (order) =>
        writeLastOrder({
          orderId: order.id,
          token: order.trackingToken,
          slug: slug ?? '',
        }),
    })
  })

  return {
    register,
    control,
    errors,
    submit,
    isDelivery,
    paymentMethod,
    paymentOptions,
    zone,
    subtotal,
    deliveryFee,
    total,
    deliveryNote,
    created,
    isSubmitting,
    submitFailed,
    isQuoting,
  }
}
