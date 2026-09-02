import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import type { Address } from '@custom_types/address/address'
import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import type { Customer } from '@custom_types/customer/customer'
import type { PublicDeliveryZone } from '@pages/checkout/types/delivery-zone/PublicDeliveryZone.type'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { Store } from '@custom_types/store/store'
import { checkoutTotals } from '@pages/checkout/utils/checkout-totals/checkout-totals'
import { useDeliveryQuote } from '@pages/checkout/hooks/useDeliveryQuote/useDeliveryQuote'
import { usePlaceOrder } from '@pages/checkout/hooks/usePlaceOrder/usePlaceOrder'
import { writeLastOrder } from '@utils/last-order'

type UseCheckoutWorkflowParams = {
  store: Store | undefined
  customer: Customer | null
  addresses: Address[]
  zones: PublicDeliveryZone[]
  isLoadingZones: boolean
  cartLines: CartLine[]
  estimatedMinutes: number | undefined
  paymentOptions: PaymentMethod[] | undefined
  clearCart: () => void
  slug: string | undefined
}

/** WHY: concentra o formulário, a cotação e a criação em uma única instância. */
export const useCheckoutWorkflow = ({
  store,
  customer,
  addresses,
  zones,
  isLoadingZones,
  cartLines,
  estimatedMinutes,
  paymentOptions: configuredPaymentOptions,
  clearCart,
  slug,
}: UseCheckoutWorkflowParams) => {
  const isAuthenticated = customer !== null
  const paymentOptions = configuredPaymentOptions ?? ['CASH']
  const form = useForm<CheckoutFormValues>({
    defaultValues: { channel: 'DELIVERY', paymentMethod: 'CASH' },
  })
  const {
    mutate: createOrder,
    isPending: isSubmitting,
    isError: submitFailed,
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
  const selectedAddress = addresses.find(({ id }) => id === deliveryAddressId)
  const { quote, isFetching: isQuoting } = useDeliveryQuote(
    store?.id,
    isAuthenticated ? selectedAddress?.zipCode : guestZipCode
  )

  useEffect(() => {
    if (isAuthenticated && !deliveryAddressId && addresses[0]) {
      setValue('deliveryAddressId', addresses[0].id)
    }
  }, [addresses, deliveryAddressId, isAuthenticated, setValue])

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

  const { subtotal, deliveryFee, total, deliveryNote } = checkoutTotals({
    cartLines,
    isDelivery,
    zone,
    estimatedMinutes,
  })

  const onSubmit = (values: CheckoutFormValues) => {
    if (!store) return

    createOrder(
      { values, store, cartLines },
      {
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
    customer,
    addresses,
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
