import type { SaleReceipt } from '@pages/Counter/types/SaleReceipt.type'
import type { CartLine } from '@shared/types/counter/cart-line'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { changeDue } from '@shared/utils/change-due/change-due'
import { moneyValue } from '@shared/utils/money/money'

type ToSaleReceiptInput = {
  orderNumber: number
  pickupCode?: string | null
  lines: CartLine[]
  total: number
  paymentMethod: PaymentMethod
  changeFor: string
  closedAt: Date
}

export const toSaleReceipt = ({
  orderNumber,
  pickupCode,
  lines,
  total,
  paymentMethod,
  changeFor,
  closedAt,
}: ToSaleReceiptInput): SaleReceipt => {
  const received =
    paymentMethod === 'CASH' && changeFor.trim() ? moneyValue(changeFor) : null
  const change = changeDue(received, total)

  return {
    orderNumber,
    pickupCode,
    closedAt: closedAt.toISOString(),
    lines,
    total,
    paymentMethod,
    receivedAmount: received,
    changeAmount: paymentMethod === 'CASH' ? change.amount : 0,
  }
}
