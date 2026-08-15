import { PAYMENT_METHOD_LABEL } from '@constants/order.constants'
import type { Order } from '@custom_types/order/order'
import type { OrderChannel } from '@custom_types/order/order-channel'
import type { OrderStage } from '@custom_types/order/order-stage'
import type { OrderStep } from '@custom_types/order/order-step'
import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'

const STAGE_OF: Record<OrderStatusKey, OrderStage> = {
  PENDING: 'incoming',
  ACCEPTED: 'confirmed',
  PREPARING: 'kitchen',
  OUT_FOR_DELIVERY: 'street',
  READY_FOR_PICKUP: 'counter',
  DELIVERED: 'closed',
  COMPLETED: 'closed',
  CANCELLED: 'closed',
}

export const stageOf = (status: OrderStatusKey): OrderStage => STAGE_OF[status]

export const isOpen = (status: OrderStatusKey): boolean =>
  STAGE_OF[status] !== 'closed'

/**
 * Etapa aberta na URL, statuses na consulta ao servidor: "fechados" junta
 * três statuses terminais, e filtrar isso no cliente exigiria ter a lista
 * inteira carregada — um pedido antigo ainda aberto simplesmente não cabe
 * na primeira página por `createdAt` e some da aba sem nunca ter saído da
 * fila de verdade.
 */
export const statusesForStage = (stage: OrderStage): OrderStatusKey[] =>
  (Object.keys(STAGE_OF) as OrderStatusKey[]).filter(
    (status) => STAGE_OF[status] === stage
  )

/**
 * Mirrors the API's transition graph, including the channel branch: delivery
 * goes to the street, pickup and counter wait at the counter. Returns null on
 * terminal statuses — nothing left to press.
 */
export const nextStep = (order: Order): OrderStep | null => {
  const { status, channel } = order

  if (status === 'PENDING') {
    return { target: 'ACCEPTED', label: 'Confirmar pedido' }
  }

  if (status === 'ACCEPTED') {
    return { target: 'PREPARING', label: 'Começar a preparar' }
  }

  if (status === 'PREPARING') {
    return channel === 'DELIVERY'
      ? { target: 'OUT_FOR_DELIVERY', label: 'Saiu para entrega' }
      : { target: 'READY_FOR_PICKUP', label: 'Pronto para retirada' }
  }

  if (status === 'OUT_FOR_DELIVERY') {
    return { target: 'DELIVERED', label: 'Marcar como entregue' }
  }

  if (status === 'READY_FOR_PICKUP') {
    return { target: 'COMPLETED', label: 'Cliente retirou' }
  }

  return null
}

/** Cancelling is allowed until the order leaves the store. */
export const canCancel = (status: OrderStatusKey): boolean =>
  status === 'PENDING' || status === 'ACCEPTED' || status === 'PREPARING'

/** Short handle for the printed ticket — the last block of the uuid. */
export const ticketNumber = (id: string): string => id.slice(-4).toUpperCase()

export const customerNameOf = (order: Order): string =>
  order.guestName ?? 'Cliente sem cadastro'

export const addressOf = (order: Order): string | null => {
  if (!order.guestStreet) return null

  const line = [order.guestStreet, order.guestNumber].filter(Boolean).join(', ')
  const rest = [order.guestComplement, order.guestNeighborhood]
    .filter(Boolean)
    .join(' · ')

  return rest ? `${line} — ${rest}` : line
}

/**
 * O mesmo meio de pagamento tem nome diferente conforme o canal: no balcão
 * ninguém fala "cartão na entrega".
 */
export const paymentLabelFor = (
  method: PaymentMethod,
  channel: OrderChannel
): string => {
  if (method !== 'CARD_ON_DELIVERY') return PAYMENT_METHOD_LABEL[method]
  return channel === 'DELIVERY' ? 'Cartão na entrega' : 'Cartão'
}
