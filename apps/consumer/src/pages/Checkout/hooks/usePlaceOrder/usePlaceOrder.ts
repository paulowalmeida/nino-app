import { useMutation } from '@tanstack/react-query'

import type { CartLine } from '@custom_types/cart/cart-line'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'
import type { Store } from '@custom_types/store/store'
import { customerOrderRequest } from '@pages/checkout/adapters/customerOrderRequest.adapter/customerOrderRequest.adapter'
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
            customerOrderRequest(values, store, cartLines)
          )
        : orderService.createGuest(guestOrderRequest(values, store, cartLines)),
  })
