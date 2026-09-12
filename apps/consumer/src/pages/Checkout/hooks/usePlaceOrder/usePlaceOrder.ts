import { useMutation } from '@tanstack/react-query'

import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@pages/checkout/types/checkout/CheckoutFormValues.type'
import type { Store } from '@custom_types/store/store'
import { consumerOrderRequest } from '@pages/checkout/adapters/consumerOrderRequest.adapter/consumerOrderRequest.adapter'
import { guestOrderRequest } from '@pages/checkout/adapters/guestOrderRequest.adapter/guestOrderRequest.adapter'
import { orderService } from '@shared/services/order/order.service'

type PlaceOrderInput = {
  values: CheckoutFormValues
  store: Store
  cartLines: CartLine[]
}

export const usePlaceOrder = (isAuthenticated: boolean) =>
  useMutation({
    mutationFn: ({ values, store, cartLines }: PlaceOrderInput) =>
      isAuthenticated
        ? orderService.createMine(
            consumerOrderRequest(values, store, cartLines)
          )
        : orderService.createGuest(guestOrderRequest(values, store, cartLines)),
  })
