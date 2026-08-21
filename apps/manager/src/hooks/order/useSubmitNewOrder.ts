import { useState } from 'react'

import type { CartLine } from '@custom_types/counter/cart-line'
import type { OrderChannel } from '@custom_types/order/order-channel'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { Recipient } from '@custom_types/order/recipient'
import { toCreateOrderRequest } from '@adapters/new-order.adapter'

import { useCreateOrder } from './useCreateOrder'

type SubmitNewOrderInput = {
  lines: CartLine[]
  channel: OrderChannel
  paymentMethod: PaymentMethod
  recipient: Recipient
  notes: string
}

type SubmitNewOrder = {
  failed: boolean
  isSubmitting: boolean
  submit: (input: SubmitNewOrderInput) => Promise<string | null>
}

export const useSubmitNewOrder = (
  tenantId: string | null
): SubmitNewOrder => {
  const { mutateAsync: createOrder, isPending: isSubmitting } =
    useCreateOrder(tenantId)
  const [failed, setFailed] = useState(false)

  const submit = async (input: SubmitNewOrderInput) => {
    setFailed(false)

    try {
      const order = await createOrder(toCreateOrderRequest(input))
      return order.id
    } catch {
      setFailed(true)
      return null
    }
  }

  return { failed, isSubmitting, submit }
}
