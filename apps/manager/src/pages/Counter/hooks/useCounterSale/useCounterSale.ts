import { useState } from 'react'

import { ApiError } from '@nino/lib/utils/api-error'
import { toCounterSaleRequest } from '@pages/Counter/adapters/counter-sale.adapter/counter-sale.adapter'
import type { CounterSaleInput } from '@pages/Counter/types/CounterSaleInput.type'
import { useCreateOrder } from '@shared/hooks/order/useCreateOrder/useCreateOrder'

type CounterSale = {
  error: string | null
  isSending: boolean
  sell: (input: CounterSaleInput) => Promise<number | null>
  reset: () => void
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
    changeFor,
  }: CounterSaleInput) => {
    setError(null)

    if (!customerName && !tableNumber) {
      setError(NO_RECIPIENT)
      return null
    }

    try {
      const order = await placeOrder(
        toCounterSaleRequest({
          lines,
          paymentMethod,
          customerName,
          tableNumber,
          changeFor,
        })
      )

      return order.orderNumber
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status < 500
          ? caught.message
          : UNEXPECTED
      )
      return null
    }
  }

  return { error, isSending, sell, reset: () => setError(null) }
}
