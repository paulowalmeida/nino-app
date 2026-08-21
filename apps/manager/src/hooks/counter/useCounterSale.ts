import { useState } from 'react'

import { ApiError } from '@nino/lib/utils/api-error'
import type { CartLine } from '@custom_types/counter/cart-line'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import { useCreateOrder } from '@hooks/order/useCreateOrder'

type CounterSaleInput = {
  lines: CartLine[]
  paymentMethod: PaymentMethod
  customerName: string
  tableNumber: string
}

type CounterSale = {
  error: string | null
  isSending: boolean
  sell: (input: CounterSaleInput) => Promise<string | null>
}

const NO_RECIPIENT = 'Informe o nome do cliente ou o número da mesa.'
const UNEXPECTED = 'Não foi possível fechar a venda. Tente de novo.'

export const useCounterSale = (tenantId: string | null): CounterSale => {
  const { mutateAsync: placeOrder, isPending: isSending } =
    useCreateOrder(tenantId)
  const [error, setError] = useState<string | null>(null)

  const sell = async ({
    lines,
    paymentMethod,
    customerName,
    tableNumber,
  }: CounterSaleInput) => {
    setError(null)

    if (!customerName && !tableNumber) {
      setError(NO_RECIPIENT)
      return null
    }

    try {
      const order = await placeOrder({
        channel: 'COUNTER',
        paymentMethod,
        guestName: customerName || undefined,
        tableNumber: tableNumber || undefined,
        items: lines.map(({ productId, quantity, unitPrice }) => ({
          productId,
          quantity,
          unitPrice: Number(unitPrice),
        })),
      })

      return order.id
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status < 500
          ? caught.message
          : UNEXPECTED
      )
      return null
    }
  }

  return { error, isSending, sell }
}
