import type { Order } from '@shared/types/order/order'

/**
 * WHY: a fila natural é por hora de chegada, mas quem cozinha decide a ordem
 * de fazer — panela, forno e prato que sai junto mandam mais que o relógio. A
 * arrumação à mão vale para quem ela nomeia; o que chegou depois entra na
 * frente, porque comanda nova escondida no fim da coluna é comanda perdida.
 */
export const arrangeOrders = (
  orders: Order[],
  arrangement: string[] | undefined
): Order[] => {
  if (!arrangement?.length) return orders

  const byId = new Map(orders.map((order) => [order.id, order]))
  const arranged = arrangement.flatMap((id) => {
    const order = byId.get(id)
    return order ? [order] : []
  })
  const newcomers = orders.filter(({ id }) => !arrangement.includes(id))

  return [...newcomers, ...arranged]
}

/** A sequência de ids depois de mover um card para a posição de outro. */
export const moveWithin = (
  orderIds: string[],
  movedId: string,
  targetId: string | null
): string[] => {
  if (targetId === movedId) return orderIds

  const from = orderIds.indexOf(movedId)
  const without = orderIds.filter((id) => id !== movedId)

  if (!targetId) return [...without, movedId]

  const target = without.indexOf(targetId)

  if (target < 0) return [...without, movedId]

  const movesForward = from >= 0 && from < orderIds.indexOf(targetId)
  const at = movesForward ? target + 1 : target

  return [...without.slice(0, at), movedId, ...without.slice(at)]
}
