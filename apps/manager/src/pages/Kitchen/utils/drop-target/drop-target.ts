import type { KitchenStage } from '@pages/Kitchen/types/KitchenStage.type'
import type { Order } from '@shared/types/order/order'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'

/**
 * WHY: espelha o grafo da API, avanços e retrocessos. Um destino que o
 * servidor recusaria não pode acender na tela — o chapista arrastaria até lá
 * e levaria um 422 depois de soltar.
 */
const REACHABLE: Record<KitchenStage, OrderStatusKey[]> = {
  waiting: ['PREPARING'],
  preparing: ['ACCEPTED'],
  finished: ['PREPARING'],
}

/** Retirada, balcão e mesa esperam no balcão; entrega sai para a rua. */
const finishedTarget = (order: Order): OrderStatusKey =>
  order.channel === 'DELIVERY' ? 'OUT_FOR_DELIVERY' : 'READY_FOR_PICKUP'

const TARGET: Record<KitchenStage, OrderStatusKey | null> = {
  waiting: 'ACCEPTED',
  preparing: 'PREPARING',
  finished: null,
}

/** O status que o pedido assume ao ser solto no trilho, ou null se não pode. */
export const dropTarget = (
  order: Order,
  stage: KitchenStage
): OrderStatusKey | null => {
  if (!REACHABLE[stage].includes(order.status)) return null

  return stage === 'finished' ? finishedTarget(order) : TARGET[stage]
}
