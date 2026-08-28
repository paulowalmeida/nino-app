import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import type { PaymentMethod } from '@shared/types/order/payment-method'

export const useCounterPaymentSelection = (
  methods: PaymentMethod[],
  total = 0
) => {
  const chosen = useCounterStore((state) => state.chosenPaymentMethod)
  const changeFor = useCounterStore((state) => state.changeFor ?? '')
  const method =
    chosen && methods.includes(chosen) ? chosen : (methods[0] ?? null)
  const received = Number(changeFor)
  const isCash = method === 'CASH'
  const isChangeValid =
    !isCash ||
    (changeFor.trim() !== '' && Number.isFinite(received) && received >= total)

  return {
    method,
    changeFor,
    changeAmount: isCash && isChangeValid ? received - total : 0,
    isChangeValid,
  }
}
