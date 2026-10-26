import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import { payableNotes } from '@pages/Counter/utils/payableNotes/payableNotes'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { changeDue } from '@shared/utils/change-due/change-due'
import { moneyValue } from '@shared/utils/money/money'

export const useCounterPaymentSelection = (
  methods: PaymentMethod[],
  total = 0
) => {
  const chosen = useCounterStore((state) => state.chosenPaymentMethod)
  const changeFor = useCounterStore((state) => state.changeFor ?? '')
  const method =
    chosen && methods.includes(chosen) ? chosen : (methods[0] ?? null)
  const isCash = method === 'CASH'
  const received = changeFor.trim() ? moneyValue(changeFor) : null
  const change = changeDue(received, total)

  return {
    method,
    changeFor,
    changeAmount: isCash ? change.amount : 0,
    hasChange: isCash && change.hasChange,
    isChangeValid: !isCash || change.isValid,
    suggestedNotes: payableNotes(total),
  }
}
