import { COUNTER_PAYMENT_SPOKEN } from '@pages/Counter/constants/counter.constants'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import { brl } from '@shared/utils/money/money'

type ReadbackParams = {
  channel: OrderChannel | null
  consumerName: string
  addressLine: string
  method: PaymentMethod | null
  changeAmount: number
}

const destinationPhrase = (
  channel: OrderChannel | null,
  who: string,
  addressLine: string
): string => {
  if (channel === 'DELIVERY') return `Entrega para ${who}, na ${addressLine}.`
  if (channel === 'COUNTER') return `No local, para ${who}.`
  return `Retirada no balcão para ${who}.`
}

/**
 * A frase que o atendente lê de volta antes de fechar. É o pedido dito em voz
 * alta, não um resumo em campos: por isso sai em uma linha corrida.
 */
export const counterReadback = ({
  channel,
  consumerName,
  addressLine,
  method,
  changeAmount,
}: ReadbackParams): string => {
  const who = consumerName.trim() || 'o cliente'
  const destination = destinationPhrase(channel, who, addressLine)

  const payment =
    method === 'CARD_ON_DELIVERY'
      ? 'Paga com cartão na entrega'
      : `Paga com ${method ? COUNTER_PAYMENT_SPOKEN[method] : '—'}`
  const change = changeAmount > 0 ? `, troco de ${brl(changeAmount)}` : ''

  return `${destination} ${payment}${change}.`
}
