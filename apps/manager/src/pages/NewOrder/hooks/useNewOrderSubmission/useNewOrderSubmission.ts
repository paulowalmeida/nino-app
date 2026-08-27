import { useState } from 'react'

import { toCreateOrderRequest } from '@pages/NewOrder/adapters/newOrder.adapter/newOrder.adapter'
import type { NewOrderSubmissionInput } from '@pages/NewOrder/types/NewOrderSubmissionInput.type'
import { useCreateOrder } from '@shared/hooks/order/useCreateOrder/useCreateOrder'

export const useNewOrderSubmission = (tenantId: string | null) => {
  const { mutateAsync: createOrder, isPending: isSubmitting } =
    useCreateOrder(tenantId)
  const [failed, setFailed] = useState(false)

  const submit = async (input: NewOrderSubmissionInput) => {
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
