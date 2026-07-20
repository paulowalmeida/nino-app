import { Link } from 'react-router'

import { Button } from '@nino/ds'

import { brl } from '@utils/money'
import {
  CHANNEL_LABEL,
  customerNameOf,
  nextStep,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  STATUS_LABEL,
  ticketNumber,
} from '@utils/order-flow'

import type { OrderTicketProps } from './OrderTicket.types'

import styles from './OrderTicket.module.css'
import motion from '@styles/motion.module.css'

const time = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

/** Up to three lines, then a count — the ticket stays readable at a glance. */
const VISIBLE_ITEMS = 3

export const OrderTicket = ({
  order,
  onAdvance,
  isBusy,
}: OrderTicketProps) => {
  const step = nextStep(order)
  const hidden = order.items.length - VISIBLE_ITEMS
  const isWaiting = order.status === 'PENDING'
  const isCancelled = order.status === 'CANCELLED'

  return (
    <article
      className={`${styles.ticket} ${isWaiting ? styles.waiting : ''} ${
        isCancelled ? styles.cancelled : ''
      }`}
    >
      <header className={styles.head}>
        <span className={styles.number}>#{ticketNumber(order.id)}</span>
        <time className={styles.time} dateTime={order.createdAt}>
          {time.format(new Date(order.createdAt))}
        </time>
        <span className={styles.channel}>{CHANNEL_LABEL[order.channel]}</span>
      </header>

      <Link
        to={order.id}
        className={`${motion.lift} ${styles.body}`}
        aria-label={`Abrir pedido ${ticketNumber(order.id)}`}
      >
        <p className={styles.customer}>
          {customerNameOf(order)}
          {order.tableNumber && (
            <span className={styles.table}>mesa {order.tableNumber}</span>
          )}
        </p>
        <p className={styles.state}>{STATUS_LABEL[order.status]}</p>

        {/* no celular a comanda inteira não cabe: vale a conta, não a lista */}
        <p className={styles.summary}>
          {order.items.reduce((total, { quantity }) => total + quantity, 0)}{' '}
          {order.items.length === 1 ? 'item' : 'itens'} ·{' '}
          {order.items.map(({ product }) => product.name).join(', ')}
        </p>

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
        <div className={styles.money}>
          <span className={styles.total}>{brl(order.totalAmount)}</span>
          <span className={styles.payment}>
            {PAYMENT_METHOD_LABEL[order.paymentMethod]} ·{' '}
            {PAYMENT_STATUS_LABEL[order.paymentStatus]}
          </span>
        </div>

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
  )
}
