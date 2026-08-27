import { Box } from '@nino/ds/components/Box'
import {
  ORDER_TIMELINE_REALM_LABEL,
  STATUS_LABEL,
} from '@shared/constants/order.constants'
import type { OrderStatusEntry } from '@shared/types/order/order-status-entry'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './OrderTimeline.module.css'

const clock = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export type OrderTimelineProps = {
  entries: OrderStatusEntry[]
}

/** Oldest first: the order's own account of what happened, in order. */
export const OrderTimeline = ({ entries }: OrderTimelineProps) => {
  const sorted = [...entries].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
  )

  return (
    <Box as="ol" direction="column">
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
              {ORDER_TIMELINE_REALM_LABEL[entry.changedByRealm] ?? ''}
            </span>
          </span>
          <time className={styles.at} dateTime={entry.createdAt}>
            {clock.format(new Date(entry.createdAt))}
          </time>
        </li>
      ))}
    </Box>
  )
}
