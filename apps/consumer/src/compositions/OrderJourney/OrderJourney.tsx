import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import type { OrderStatus } from '@custom_types/order/order-status'
import { clockLabel } from '@utils/clock'
import { STATUS_LABEL } from '@utils/order-flow'
import { isTerminal, journeyFor, stageIcon } from '@utils/order-journey'
import { riseDelay } from '@utils/rise-delay'

import type { OrderJourneyProps } from './OrderJourney.types'

import styles from './OrderJourney.module.css'
import motion from '@styles/motion.module.css'

type RowState = 'done' | 'current' | 'final' | 'ahead'

type Row = {
  status: OrderStatus
  at?: string
  state: RowState
}

/** O que já aconteceu, na ordem em que aconteceu, com o último em destaque. */
const fromHistory = (order: GuestOrderStatus): Row[] =>
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
const buildRows = (order: GuestOrderStatus): Row[] => {
  const rows = (() => {
    if (order.status === 'CANCELLED') return fromHistory(order)

    const journey = journeyFor(order.channel)
    const current = journey.indexOf(order.status)
    if (current === -1) return fromHistory(order)

    const at = new Map(order.timeline.map((entry) => [entry.status, entry.at]))

    return journey.map<Row>((status, i) => ({
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

const rowStyles: Record<RowState, string> = {
  done: styles.done,
  current: styles.current,
  final: styles.final,
  ahead: styles.ahead,
}

const CHECK = '✓'

export const OrderJourney = ({
  order,
  className,
  style,
}: OrderJourneyProps) => {
  const rows = buildRows(order)
  const lastAhead = rows.at(-1)?.state === 'ahead' ? rows.length - 1 : -1

  return (
    <ol className={`${styles.list} ${className ?? ''}`} style={style}>
      {rows.map((row, i) => (
        <li
          key={row.status}
          className={[
            motion.riseIn,
            styles.row,
            rowStyles[row.state],
            row.status === 'CANCELLED' ? styles.cancelled : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={riseDelay(60 + i * 55)}
          aria-current={row.state === 'current' ? 'step' : undefined}
        >
          <span className={styles.node} aria-hidden="true">
            {row.state === 'done' ||
            (row.state === 'final' && row.status !== 'CANCELLED')
              ? CHECK
              : stageIcon(row.status)}
          </span>

          <p className={styles.label}>{STATUS_LABEL[row.status]}</p>

          {row.at && <p className={styles.time}>{clockLabel(row.at)}</p>}

          {!row.at && i === lastAhead && order.estimatedDeliveryAt && (
            <p className={styles.time}>
              ~ {clockLabel(order.estimatedDeliveryAt)}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}
