import type { OrderJourneyRow as OrderJourneyRowData } from '@custom_types/order/order-journey-row'
import { clockLabel } from '@utils/clock'
import { STATUS_LABEL } from '@utils/order-flow'
import { stageIcon } from '@utils/order-journey'
import { riseDelay } from '@utils/rise-delay'

import styles from './OrderJourneyRow.module.css'
import motion from '@styles/motion.module.css'

const rowStyles: Record<OrderJourneyRowData['state'], string> = {
  done: styles.done,
  current: styles.current,
  final: styles.final,
  ahead: styles.ahead,
}

const CHECK = '✓'

type OrderJourneyRowProps = {
  row: OrderJourneyRowData
  index: number
  estimatedAt?: string
}

/** Um passo do pedido: marcador, nome da etapa e a hora (real ou prevista). */
export const OrderJourneyRow = ({
  row,
  index,
  estimatedAt,
}: OrderJourneyRowProps) => (
  <li
    className={[
      motion.riseIn,
      styles.row,
      rowStyles[row.state],
      row.status === 'CANCELLED' ? styles.cancelled : '',
    ]
      .filter(Boolean)
      .join(' ')}
    style={riseDelay(60 + index * 55)}
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

    {!row.at && estimatedAt && (
      <p className={styles.time}>~ {clockLabel(estimatedAt)}</p>
    )}
  </li>
)
