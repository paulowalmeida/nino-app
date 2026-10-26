import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { PayTabRequest } from '@shared/types/tab/pay-tab-request.type'
import { moneyValue } from '@shared/utils/money/money'

export const tabPaymentRequest = (
  method: PaymentMethod,
  amountText: string,
  receivedAmountText: string
): PayTabRequest => {
  const amount = moneyValue(amountText)
  const hasReceivedAmount = method === 'CASH' && !!receivedAmountText.trim()
  return hasReceivedAmount
    ? { method, amount, amountReceived: moneyValue(receivedAmountText) }
    : { method, amount }
}
