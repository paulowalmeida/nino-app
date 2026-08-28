import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Card } from '@nino/ds/components/Card'
import { toOrderBadgeVariant } from '@shared/adapters/order-badge.adapter/order-badge.adapter'
import {
  CHANNEL_LABEL,
  PAYMENT_METHOD_LABEL_BY_CHANNEL,
  PAYMENT_STATUS_LABEL,
  STATUS_LABEL,
} from '@shared/constants/order.constants'
import { useElapsed } from '@shared/hooks/order/useElapsed/useElapsed'
import type { Order } from '@shared/types/order/order'
import type { OrderStatusKey } from '@shared/types/order/order-status-key'
import { brl } from '@shared/utils/money/money'
import { nextStep } from '@shared/utils/order-action-policy/order-action-policy'
import { customerNameOf } from '@shared/utils/order-customer/order-customer'
import { stageOf } from '@shared/utils/order-stage/order-stage'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

import motion from '@styles/motion.module.css'
import styles from './OrderTicket.module.css'

const time = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const dayMonth = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

/** "Fechados" holds orders from any day — the clock alone reads as today's,
 *  so a closed ticket from before today needs the date too. */
const isFromToday = (date: Date): boolean =>
  startOfDay(date) === startOfDay(new Date())

/** Up to three lines, then a count — the ticket stays readable at a
 * glance. */
const VISIBLE_ITEMS = 3

export type OrderTicketProps = {
  order: Order
  /** Runs the single move available on this order right now. */
  onAdvance: (orderId: string, target: OrderStatusKey) => void
  isBusy?: boolean
}

export const OrderTicket = ({ order, onAdvance, isBusy }: OrderTicketProps) => {
  const step = nextStep(order)
  const hidden = order.items.length - VISIBLE_ITEMS
  const isWaiting = order.status === 'PENDING'
  const isCancelled = order.status === 'CANCELLED'
  /** A closed order has no timer: the full clock time matters again. */
  const isDone = isCancelled || stageOf(order.status) === 'closed'
  const { label: elapsed, isLate } = useElapsed(order.createdAt)
  const createdAt = new Date(order.createdAt)
  const clock = time.format(createdAt)
  const clockLabel = isFromToday(createdAt)
    ? clock
    : `${dayMonth.format(createdAt)} · ${clock}`

  const classes = [
    styles.ticket,
    isWaiting ? styles.waiting : '',
    isCancelled ? styles.cancelled : '',
    isLate && !isDone ? styles.late : '',
  ]

  const waitedClass = isLate
    ? `${styles.waited} ${styles.overdue}`
    : styles.waited

  return (
    <Card asChild className={classes.filter(Boolean).join(' ')}>
      <article>
        <header className={styles.head}>
          <span className={styles.number}>
            #{ticketNumber(order.orderNumber)}
          </span>
          {isDone ? (
            <time className={styles.time} dateTime={order.createdAt}>
              {clockLabel}
            </time>
          ) : (
            <time
              className={waitedClass}
              dateTime={order.createdAt}
              title={`Entrou às ${clock}`}
            >
              {elapsed}
            </time>
          )}
          <Badge
            size="sm"
            variant={toOrderBadgeVariant(order.status)}
            className={styles.status}
          >
            {STATUS_LABEL[order.status]}
          </Badge>
        </header>

        <Link
          to={order.id}
          className={`${motion.lift} ${styles.body}`}
          aria-label={`Abrir pedido ${ticketNumber(order.orderNumber)}`}
        >
          <p className={styles.customer}>{customerNameOf(order)}</p>
          <p className={styles.meta}>
            {CHANNEL_LABEL[order.channel]}
            {order.tableNumber && ` · Mesa ${order.tableNumber}`}
          </p>

          {/* the whole ticket doesn't fit on mobile: the count matters,
            not the list */}
          <p className={styles.summary}>
            {order.items.reduce((total, { quantity }) => total + quantity, 0)}{' '}
            {order.items.length === 1 ? 'item' : 'itens'} ·{' '}
            {order.items.map(({ product }) => product.name).join(', ')}
          </p>

          {order.notes && (
            <p className={styles.notes}>
              <span className={styles.notesLabel}>Observação</span>
              {order.notes}
            </p>
          )}

          <ul className={styles.items}>
            {order.items.slice(0, VISIBLE_ITEMS).map((item) => (
              <li key={item.id} className={styles.item}>
                <span className={styles.quantity}>{item.quantity}×</span>
                <span className={styles.itemName}>{item.product.name}</span>
              </li>
            ))}
            {hidden > 0 && (
              <li className={styles.more}>
                e mais {hidden} {hidden === 1 ? 'item' : 'itens'}
              </li>
            )}
          </ul>
        </Link>

        <footer className={styles.foot}>
          <Box direction="column">
            <span className={styles.total}>{brl(order.totalAmount)}</span>
            <span className={styles.payment}>
              {
                PAYMENT_METHOD_LABEL_BY_CHANNEL[order.channel][
                  order.paymentMethod
                ]
              }{' '}
              · {PAYMENT_STATUS_LABEL[order.paymentStatus]}
            </span>
          </Box>

          {step && (
            <Button
              size="sm"
              loading={isBusy}
              className={`${motion.press} ${styles.action}`}
              onClick={() => onAdvance(order.id, step.target)}
            >
              {step.label}
            </Button>
          )}
        </footer>
      </article>
    </Card>
  )
}
