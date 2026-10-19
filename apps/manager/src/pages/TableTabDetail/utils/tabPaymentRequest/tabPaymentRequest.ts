import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { PayTabRequest } from '@shared/types/tab/pay-tab-request'
import { moneyValue } from '@shared/utils/money/money'

export const tabPaymentRequest = (
  method: PaymentMethod,
  receivedAmountText: string
): PayTabRequest =>
  method === 'CASH' && receivedAmountText.trim()
    ? { method, amountReceived: moneyValue(receivedAmountText) }
    : { method }
