import { useState } from 'react'

import { ApiError } from '@nino/lib/utils/api-error'
import { toCounterSaleRequest } from '@pages/Counter/adapters/counter-sale.adapter/counter-sale.adapter'
import type { CounterSaleInput } from '@pages/Counter/types/CounterSaleInput.type'
import { hasPickupRecipient } from '@pages/Counter/utils/hasPickupRecipient/hasPickupRecipient'
import { useCreateOrder } from '@shared/hooks/order/useCreateOrder/useCreateOrder'
import type { Order } from '@shared/types/order/order'

type CounterSale = {
  error: string | null
  isSending: boolean
  sell: (
    input: CounterSaleInput
  ) => Promise<Pick<Order, 'orderNumber' | 'pickupCode'> | null>
  reset: () => void
}

const NO_RECIPIENT = 'Informe o nome de quem pediu.'
const UNEXPECTED = 'Não foi possível fechar a venda. Tente de novo.'

export const useCounterSale = (unitId: string | null): CounterSale => {
  const { mutateAsync: placeOrder, isPending: isSending } =
    useCreateOrder(unitId)
  const [error, setError] = useState<string | null>(null)

  const sell = async ({
    lines,
    channel = 'COUNTER',
    paymentMethod,
    consumerName,
    tableNumber,
    recipient,
    changeFor,
  }: CounterSaleInput) => {
    setError(null)

    if (
      channel === 'PICKUP' &&
      (!recipient || !hasPickupRecipient(recipient))
    ) {
      setError('Preencha nome e telefone para retirada.')
      return null
    }

    const orderConsumerName =
      channel === 'DELIVERY' || channel === 'PICKUP'
        ? (recipient?.name ?? '')
        : consumerName

    if (!orderConsumerName.trim()) {
      setError(NO_RECIPIENT)
      return null
    }

    try {
      const order = await placeOrder(
        toCounterSaleRequest({
          lines,
          channel,
          paymentMethod,
          consumerName,
          tableNumber,
          recipient,
          changeFor,
        })
      )

      return { orderNumber: order.orderNumber, pickupCode: order.pickupCode }
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
