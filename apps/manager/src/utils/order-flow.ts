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

const formatAddress = (
  street: string,
  number: string | null,
  complement: string | null,
  neighborhood: string | null
): string => {
  const line = [street, number].filter(Boolean).join(', ')
  const rest = [complement, neighborhood].filter(Boolean).join(' · ')

  return rest ? `${line} — ${rest}` : line
}

/**
 * A saved address (`deliveryAddress`) comes from a customer's account; the
 * `guest*` fields hold what a guest checkout typed by hand. A delivery
 * order carries one or the other, never both.
 */
export const addressOf = (order: Order): string | null => {
  if (order.deliveryAddress) {
    const { street, number, complement, neighborhood } = order.deliveryAddress
    return formatAddress(street, number, complement, neighborhood)
  }

  if (!order.guestStreet) return null

  return formatAddress(
    order.guestStreet,
    order.guestNumber,
    order.guestComplement,
    order.guestNeighborhood
  )
}

/**
 * `CARD_ONLINE` is charged during checkout, before the order exists — at
 * the counter someone is already standing there with a card or cash, so
 * there's no "online" step left to offer.
 */
export const paymentMethodsFor = (
  methods: PaymentMethod[],
  channel: OrderChannel
): PaymentMethod[] =>
  channel === 'COUNTER'
    ? methods.filter((method) => method !== 'CARD_ONLINE')
    : methods

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
