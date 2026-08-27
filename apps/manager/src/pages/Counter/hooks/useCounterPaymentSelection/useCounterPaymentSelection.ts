import { useCounterStore } from '@pages/Counter/states/counter/counter.store'
import type { PaymentMethod } from '@shared/types/order/payment-method'

export const useCounterPaymentSelection = (methods: PaymentMethod[]) => {
  const chosen = useCounterStore((state) => state.chosenPaymentMethod)

  return {
    method: chosen && methods.includes(chosen) ? chosen : (methods[0] ?? null),
  }
}
