import { useNewOrderStore } from '@pages/NewOrder/states/new-order/new-order.store'
import type { NewOrderDraft } from '@pages/NewOrder/types/NewOrderDraft.type'

export const useNewOrderDraft = (): NewOrderDraft => {
  const draft = useNewOrderStore()

  return {
    ...draft,
    subtotal: draft.lines.reduce(
      (sum, line) => sum + Number(line.unitPrice) * line.quantity,
      0
    ),
  }
}
