import type { CSSProperties } from 'react'

import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { orderJourneyRows } from '@adapters/orderJourneyRows.adapter'
import { OrderJourneyRow } from '@elements/OrderJourneyRow/OrderJourneyRow'

import styles from './OrderJourney.module.css'

type OrderJourneyProps = {
  order: GuestOrderStatus
  className?: string
  style?: CSSProperties
}

export const OrderJourney = ({
  order,
  className,
  style,
}: OrderJourneyProps) => {
  const rows = orderJourneyRows(order)
  const lastAhead = rows.at(-1)?.state === 'ahead' ? rows.length - 1 : -1

  return (
    <ol className={`${styles.list} ${className ?? ''}`} style={style}>
      {rows.map((row, i) => (
        <OrderJourneyRow
          key={row.status}
          row={row}
          index={i}
          estimatedAt={
            i === lastAhead ? (order.estimatedDeliveryAt ?? undefined) : undefined
          }
        />
      ))}
    </ol>
  )
}
