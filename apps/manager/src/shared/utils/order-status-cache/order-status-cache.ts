import type { InfiniteData } from '@tanstack/react-query'

import type { Order } from '@shared/types/order/order'
import type { OrderPage } from '@shared/types/order/order-page'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'

/**
 * WHY: cada trilho da parede é uma consulta com seu próprio filtro de status,
 * então mudar de coluna não é editar um campo — é sair de uma lista e entrar
 * em outra. Sem isso o card só troca de trilho quando o servidor responde, e
 * a cozinha fica meio segundo sem saber se o toque pegou.
 */
export const applyStatusToList = (
  data: InfiniteData<OrderPage>,
  statuses: OrderStatusKey[] | null,
  order: Order,
  status: OrderStatusKey
): InfiniteData<OrderPage> => {
  const belongs = !statuses?.length || statuses.includes(status)
  const withoutOrder = data.pages.map((page) => ({
    ...page,
    data: page.data.filter(({ id }) => id !== order.id),
  }))

  if (!belongs || !withoutOrder.length) {
    return { ...data, pages: withoutOrder }
  }

  const [first, ...rest] = withoutOrder

  return {
    ...data,
    pages: [{ ...first, data: [{ ...order, status }, ...first.data] }, ...rest],
  }
}

/** O filtro de status que a chave da consulta carrega, em CSV. */
export const statusesFromKey = (
  statusKey: unknown
): OrderStatusKey[] | null =>
  typeof statusKey === 'string' && statusKey.length
    ? (statusKey.split(',') as OrderStatusKey[])
    : null

/** O pedido, buscado em qualquer lista já em cache. */
export const findOrderInLists = (
  lists: InfiniteData<OrderPage>[],
  orderId: string
): Order | null => {
  for (const list of lists) {
    for (const page of list.pages) {
      const found = page.data.find(({ id }) => id === orderId)
      if (found) return found
    }
  }

  return null
}
