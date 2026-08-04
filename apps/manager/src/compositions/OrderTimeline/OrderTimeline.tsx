import { riseDelay } from '@utils/rise-delay'
import { STATUS_LABEL } from '@utils/order-flow'
import type { OrderStatusEntry } from '@custom_types/order'

import styles from './OrderTimeline.module.css'
import motion from '@styles/motion.module.css'

const clock = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const REALM_LABEL: Record<string, string> = {
  OPERATIONAL: 'pela loja',
  BACKOFFICE: 'pelo suporte',
  CUSTOMER: 'pelo cliente',
  GUEST: 'pelo cliente',
}

export type OrderTimelineProps = {
  entries: OrderStatusEntry[]
}

/** Oldest first: the order's own account of what happened, in order. */
export const OrderTimeline = ({ entries }: OrderTimelineProps) => {
  const sorted = [...entries].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
  )

  return (
    <ol className={styles.timeline}>
      {sorted.map((entry, index) => (
        <li
          key={entry.id}
          className={`${motion.deal} ${styles.entry} ${
            index === sorted.length - 1 ? styles.last : ''
          }`}
          style={riseDelay(index * 60 + 120)}
        >
          <span className={styles.mark} />
          <span className={styles.label}>
            {STATUS_LABEL[entry.status]}
            <span className={styles.author}>
              {' '}
              {REALM_LABEL[entry.changedByRealm] ?? ''}
            </span>
          </span>
          <time className={styles.at} dateTime={entry.createdAt}>
            {clock.format(new Date(entry.createdAt))}
          </time>
        </li>
      ))}
    </ol>
  )
}
