import { useNavigate } from 'react-router'

import { useNewOrderSubmission } from '@pages/NewOrder/hooks/useNewOrderSubmission/useNewOrderSubmission'
import type { NewOrderDraft } from '@pages/NewOrder/types/NewOrderDraft.type'
import type { PaymentMethod } from '@shared/types/order/payment-method'

export const useNewOrderPlacement = (
  unitId: string | null,
  draft: NewOrderDraft,
  paymentMethod: PaymentMethod
) => {
  const navigate = useNavigate()
  const { failed, isSubmitting, submit } = useNewOrderSubmission(unitId)

  const placeOrder = async () => {
    const orderId = await submit({
      lines: draft.lines,
      channel: draft.channel,
      paymentMethod,
      recipient: draft.recipient,
      notes: draft.notes,
    })

    if (orderId) void navigate(`../${orderId}`, { relative: 'path' })
  }

  return { failed, isSubmitting, placeOrder }
}
