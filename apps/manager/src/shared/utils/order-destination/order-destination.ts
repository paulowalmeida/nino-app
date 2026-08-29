import { CHANNEL_LABEL } from '@shared/constants/order.constants'
import type { Order } from '@shared/types/order/order'
import type { OrderChannel } from '@shared/types/order/order-channel'
import type { OrderDestination } from '@shared/types/order/order-destination'
import type { OrderDestinationKind } from '@shared/types/order/order-destination-kind'

const KIND_BY_CHANNEL: Record<OrderChannel, OrderDestinationKind> = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
  COUNTER: 'counter',
  TABLE_TAB: 'table',
}

const isFromTable = (order: Order): boolean =>
  order.channel === 'TABLE_TAB' || !!order.tableNumber

/**
 * WHY: `tableNumber` é texto livre — a loja cadastra tanto "3" quanto
 * "Mesa 3". Prefixar sem olhar produz "Mesa Mesa 3" na comanda.
 */
const tableLabel = (tableNumber: string | null): string => {
  const name = tableNumber?.trim()

  if (!name) return CHANNEL_LABEL.TABLE_TAB

  return /^\d/.test(name) ? `Mesa ${name}` : name
}

/**
 * WHY: a etiqueta responde "pra onde vai o prato". A mesa carrega qual, então
 * vale sozinha até numa loja de formato único; o canal só classifica, e
 * classificar entre uma opção só não informa nada — some da comanda.
 */
export const orderDestination = (
  order: Order,
  salesFormats: OrderChannel[]
): OrderDestination | null => {
  if (isFromTable(order)) {
    return { kind: 'table', label: tableLabel(order.tableNumber) }
  }

  if (salesFormats.length < 2) return null

  return {
    kind: KIND_BY_CHANNEL[order.channel],
    label: CHANNEL_LABEL[order.channel],
  }
}
