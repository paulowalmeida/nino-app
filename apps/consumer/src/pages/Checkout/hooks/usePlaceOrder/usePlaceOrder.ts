import { useRef } from 'react'
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

/**
 * A chave vive durante toda a tentativa de checkout. Repetir o submit após
 * timeout/rede ruim reaproveita a mesma chave e deixa a API devolver o mesmo
 * pedido em vez de criar outro.
 */
export const usePlaceOrder = (isAuthenticated: boolean) => {
  const idempotencyKey = useRef<string | null>(null)
  if (!idempotencyKey.current) {
    idempotencyKey.current = globalThis.crypto.randomUUID()
  }

  return useMutation({
    mutationFn: ({ values, store, cartLines }: PlaceOrderInput) =>
      isAuthenticated
        ? orderService.createMine(
            consumerOrderRequest(values, store, cartLines),
            idempotencyKey.current as string
          )
        : orderService.createGuest(
            guestOrderRequest(values, store, cartLines),
            idempotencyKey.current as string
          ),
  })
}
