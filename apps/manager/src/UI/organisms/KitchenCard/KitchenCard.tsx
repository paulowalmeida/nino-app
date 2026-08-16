import { Button } from '@nino/ds/components/Button'
import { CHANNEL_LABEL } from '@constants/order.constants'
import { useElapsed } from '@hooks/order/useElapsed'
import { elapsedVar } from '@utils/elapsed-var'
import { customerNameOf, nextStep, ticketNumber } from '@utils/order-flow'
import type { Order } from '@custom_types/order/order'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'

import styles from './KitchenCard.module.css'
import motion from '@styles/motion.module.css'

export type KitchenCardProps = {
  order: Order
  onAdvance: (orderId: string, target: OrderStatusKey) => void
  isBusy: boolean
}

/**
 * The ticket as it comes off the roll: torn paper, a number big enough to
 * read across the kitchen and no price — whoever plates the food doesn't
 * decide money. The strip at the top is the deadline draining; when it
 * fills, the whole ticket lights up.
 */
export const KitchenCard = ({ order, onAdvance, isBusy }: KitchenCardProps) => {
  const step = nextStep(order)
  const {
    label: elapsed,
    isLate,
    ratio,
  } = useElapsed(order.acceptedAt ?? order.createdAt)

  const card = `${motion.settle} ${styles.card} ${isLate ? styles.late : ''}`

  return (
    <article className={card} style={elapsedVar(ratio)}>
      <div className={styles.ribbon} aria-hidden="true">
        <span className={styles.fill} />
      </div>

      <header className={styles.head}>
        <span className={styles.number}>{ticketNumber(order.id)}</span>
        <span className={styles.clock}>{elapsed}</span>
      </header>

      <p className={styles.who}>
        <span className={styles.channel}>{CHANNEL_LABEL[order.channel]}</span>
        <span className={styles.name}>{customerNameOf(order)}</span>
        {order.tableNumber && (
          <span className={styles.table}>mesa {order.tableNumber}</span>
        )}
      </p>

      {order.notes && (
        <p className={styles.notes}>
          <span className={styles.notesLabel}>Observação</span>
          {order.notes}
        </p>
      )}

      <ul className={styles.items}>
        {order.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.quantity}>{item.quantity}</span>
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
