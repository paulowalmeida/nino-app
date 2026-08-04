import { Link } from 'react-router'

import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CountUp } from '@nino/ds/components/CountUp'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { useOrders } from '@hooks/order/useOrders'
import { brl } from '@utils/money'
import { tallyToday } from '@utils/day-tally'
import { riseDelay } from '@utils/rise-delay'
import { ticketNumber } from '@utils/order-flow'
import { STATUS_LABEL } from '@utils/order-flow'

import styles from './DayTally.module.css'
import motion from '@styles/motion.module.css'
import tile from '@styles/statTile.module.css'

const clock = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const RECENT = 4

/** Four rows while loading — matches the count that arrives. */
const SKELETON_ROWS = ['first', 'second', 'third', 'fourth']

type DayTallyProps = {
  tenantId: string | null
  timezone: string | null
}

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

      {/* Every number here links to its own drill-down: the count opens
          the closed queue, revenue and average ticket open the day's
          report. */}
      <div className={styles.tally}>
        <Card
          asChild
          className={`${motion.settle} ${motion.lift} ${styles.figure}`}
        >
          <Link
            to="../pedidos?etapa=closed"
            relative="path"
            aria-label="Ver os pedidos fechados"
            className={tile.cardOverview}
          >
            <span className={styles.value}>
              {isPending ? (
                <Skeleton className={styles.skeletonCount} />
              ) : (
                <CountUp value={count} />
              )}
            </span>
            <span className={styles.label}>pedidos fechados</span>
          </Link>
        </Card>

        <Card
          asChild
          className={`${motion.settle} ${motion.lift} ${styles.figure}`}
        >
          <Link
            to="../relatorios?periodo=today"
            relative="path"
            aria-label="Ver o relatório de faturamento de hoje"
            style={riseDelay(70)}
            className={tile.cardOverview}
          >
            <span className={styles.value}>
              {isPending ? (
                <Skeleton className={styles.skeletonMoney} />
              ) : (
                brl(revenue)
              )}
            </span>
            <span className={styles.label}>entraram no caixa</span>
          </Link>
        </Card>

        <Card
          asChild
          className={`${motion.settle} ${motion.lift} ${styles.figure}`}
        >
          <Link
            to="../relatorios?periodo=today"
            relative="path"
            aria-label="Ver o ticket médio de hoje no relatório"
            style={riseDelay(140)}
            className={tile.cardOverview}
          >
            <span className={styles.value}>
              {isPending ? (
                <Skeleton className={styles.skeletonAverage} />
              ) : (
                brl(average)
              )}
            </span>
            <span className={styles.label}>por pedido</span>
          </Link>
        </Card>
      </div>

      {isPending && (
        <ul className={styles.recent}>
          {SKELETON_ROWS.map((row) => (
            <li key={row} className={styles.entry}>
              <div className={styles.skeletonRow}>
                <Skeleton className={styles.skeletonTicket} />
                <Skeleton className={styles.skeletonState} />
                <Skeleton className={styles.skeletonAt} />
                <Skeleton className={styles.skeletonTotal} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isPending && recent.length > 0 && (
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
                <span className={styles.number}>#{ticketNumber(order.id)}</span>
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
