import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import type { OrderJourneyRow } from '@custom_types/order/order-journey-row'
import { isTerminal, journeyFor } from '@utils/order-journey'

/** Histórico ocorrido, com o último evento em destaque. */
const historyRows = (order: GuestOrderStatus): OrderJourneyRow[] =>
  order.timeline.map((entry, i) => ({
    status: entry.status,
    at: entry.at,
    state: i === order.timeline.length - 1 ? 'current' : 'done',
  }))

/**
 * Os passos que faltam entram apagados, mas entram. Ver "Seu pedido saiu para
 * entrega" ainda por vir é o que transforma uma lista de registros numa
 * previsão — a pessoa sabe quantas vezes ainda vai olhar o celular.
 */
export const orderJourneyRows = (
  order: GuestOrderStatus
): OrderJourneyRow[] => {
  const rows = (() => {
    if (order.status === 'CANCELLED') return historyRows(order)

    const journey = journeyFor(order)
    const current = journey.indexOf(order.status)
    if (current === -1) return historyRows(order)

    const at = new Map(order.timeline.map((entry) => [entry.status, entry.at]))

    return journey.map<OrderJourneyRow>((status, i) => ({
      status,
      at: at.get(status),
      state: i < current ? 'done' : i === current ? 'current' : 'ahead',
    }))
  })()

  /* Pedido encerrado não tem passo "em andamento": o último para de pulsar e
     vira o fecho da lista, ainda em destaque. */
  if (!isTerminal(order.status)) return rows

  return rows.map((row) =>
    row.state === 'current' ? { ...row, state: 'final' } : row
  )
}
