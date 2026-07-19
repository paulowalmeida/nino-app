import { Link } from 'react-router'

import { CountUp } from '@components/CountUp'
import { Eyebrow } from '@components/Eyebrow'
import { useOrders } from '@hooks/order/useOrders'
import { brl } from '@utils/money'
import { tallyToday } from '@utils/day-tally'
import { riseDelay } from '@utils/rise-delay'
import { ticketNumber } from '@utils/order-flow'
import { STATUS_LABEL } from '@utils/order-flow'

import type { DayTallyProps } from './DayTally.types'

import styles from './DayTally.module.css'
import motion from '@styles/motion.module.css'

const clock = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const RECENT = 4

export const DayTally = ({ tenantId, timezone }: DayTallyProps) => {
  const { orders, isPending } = useOrders(tenantId)

  const zone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const { orders: count, revenue, average } = tallyToday(orders, zone)
  const recent = orders.slice(0, RECENT)

  return (
    <section aria-label="O dia até agora">
      <div className={motion.unroll}>
        <Eyebrow className={styles.heading}>O dia até agora</Eyebrow>
      </div>

      <div className={styles.tally}>
        <article className={`${motion.settle} ${styles.figure}`}>
          <span className={styles.value}>
            {isPending ? '·' : <CountUp value={count} />}
          </span>
          <span className={styles.label}>pedidos fechados</span>
        </article>

        <article
          className={`${motion.settle} ${styles.figure}`}
          style={riseDelay(70)}
        >
          <span className={styles.value}>{brl(revenue)}</span>
          <span className={styles.label}>entraram no caixa</span>
        </article>

        <article
          className={`${motion.settle} ${styles.figure}`}
          style={riseDelay(140)}
        >
          <span className={styles.value}>{brl(average)}</span>
          <span className={styles.label}>por pedido</span>
        </article>
      </div>

      {recent.length > 0 && (
        <ul className={styles.recent}>
          {recent.map((order, index) => (
            <li
              key={order.id}
              className={`${motion.deal} ${styles.entry}`}
              style={riseDelay(index * 50 + 120)}
            >
              <Link
                to={`../pedidos/${order.id}`}
                relative="path"
                className={`${motion.lift} ${styles.link}`}
              >
                <span className={styles.number}>
                  #{ticketNumber(order.id)}
                </span>
                <span className={styles.state}>
                  {STATUS_LABEL[order.status]}
                </span>
                <time className={styles.at} dateTime={order.createdAt}>
                  {clock.format(new Date(order.createdAt))}
                </time>
                <span className={styles.total}>{brl(order.totalAmount)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
