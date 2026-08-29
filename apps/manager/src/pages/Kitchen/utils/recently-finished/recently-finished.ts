import type { Order } from '@shared/types/order/order'

/**
 * WHY: o pedido não guarda "saiu da cozinha" como campo — quem sabe a hora é
 * a transição para o status atual, no histórico. Sem histórico, a criação é o
 * piso possível: erra para mostrar demais, nunca para esconder o que saiu.
 */
const leftKitchenAt = (order: Order): number => {
  const entry = order.statusHistory.findLast(
    ({ status }) => status === order.status
  )

  return new Date(entry?.createdAt ?? order.createdAt).getTime()
}

/** O que saiu há pouco é operação; o resto é histórico e sai da parede. */
export const recentlyFinished = (
  orders: Order[],
  windowMinutes: number
): Order[] => {
  const floor = Date.now() - windowMinutes * 60_000

  return orders.filter((order) => leftKitchenAt(order) >= floor)
}
