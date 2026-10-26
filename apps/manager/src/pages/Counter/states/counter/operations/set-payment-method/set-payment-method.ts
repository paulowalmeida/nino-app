import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'
import type { PaymentMethod } from '@shared/types/order/payment-method'

export const setPaymentMethod = (
  set: SetCounterState,
  method: PaymentMethod | null
) => set({ chosenPaymentMethod: method })
