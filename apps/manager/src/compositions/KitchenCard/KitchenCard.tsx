import { Button } from '@nino/ds'

import { elapsedSince } from '@utils/elapsed'
import {
  CHANNEL_LABEL,
  customerNameOf,
  nextStep,
  ticketNumber,
} from '@utils/order-flow'

import type { KitchenCardProps } from './KitchenCard.types'

import styles from './KitchenCard.module.css'
import motion from '@styles/motion.module.css'

/**
 * O pedido como a cozinha precisa dele: número grande, itens em corpo de
 * leitura à distância e nenhum valor — quem monta o prato não decide preço.
 * O relógio conta desde que a loja aceitou, que é quando a promessa começou.
 */
export const KitchenCard = ({ order, onAdvance, isBusy }: KitchenCardProps) => {
  const step = nextStep(order)
  const { label: elapsed, isLate } = elapsedSince(
    order.acceptedAt ?? order.createdAt
  )

  return (
    <article
      className={`${motion.settle} ${styles.card} ${isLate ? styles.late : ''}`}
    >
      <header className={styles.head}>
        <span className={styles.number}>#{ticketNumber(order.id)}</span>
        <span className={styles.clock}>{elapsed}</span>
      </header>

      <p className={styles.who}>
        {customerNameOf(order)}
        <span className={styles.channel}>
          {CHANNEL_LABEL[order.channel]}
          {order.tableNumber && ` · mesa ${order.tableNumber}`}
        </span>
      </p>

      {order.notes && <p className={styles.notes}>{order.notes}</p>}

      <ul className={styles.items}>
        {order.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.quantity}>{item.quantity}×</span>
            <span className={styles.itemName}>{item.product.name}</span>
          </li>
        ))}
      </ul>

      {step && (
        <Button
          size="lg"
          loading={isBusy}
          className={`${motion.press} ${styles.action}`}
          onClick={() => onAdvance(order.id, step.target)}
        >
          {step.label}
        </Button>
      )}
    </article>
  )
}
