import { COUNTER_PAYMENT_SPOKEN } from '@pages/Counter/constants/counter.constants'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { brl } from '@shared/utils/money/money'

type ReadbackParams = {
  channel: OrderChannel | null
  customerName: string
  tableNumber: string
  addressLine: string
  method: PaymentMethod | null
  changeAmount: number
}

const destinationPhrase = (
  channel: OrderChannel | null,
  who: string,
  tableNumber: string,
  addressLine: string
): string => {
  if (channel === 'DELIVERY') return `Entrega para ${who}, na ${addressLine}.`
  if (channel === 'COUNTER') {
    const table = tableNumber.trim() ? `, mesa ${tableNumber.trim()}` : ''
    return `No local${table}, para ${who}.`
  }
  return `Retirada no balcão para ${who}.`
}

/**
 * A frase que o atendente lê de volta antes de fechar. É o pedido dito em voz
 * alta, não um resumo em campos: por isso sai em uma linha corrida.
 */
export const counterReadback = ({
  channel,
  customerName,
  tableNumber,
  addressLine,
  method,
  changeAmount,
}: ReadbackParams): string => {
  const who = customerName.trim() || 'o cliente'
  const destination = destinationPhrase(channel, who, tableNumber, addressLine)

  const payment = method === 'CARD_ON_DELIVERY'
    ? 'Paga com cartão na entrega'
    : `Paga com ${method ? COUNTER_PAYMENT_SPOKEN[method] : '—'}`
  const change = changeAmount > 0 ? `, troco de ${brl(changeAmount)}` : ''

  return `${destination} ${payment}${change}.`
}
