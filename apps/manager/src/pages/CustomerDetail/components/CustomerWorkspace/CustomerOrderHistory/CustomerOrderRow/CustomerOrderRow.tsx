import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Text } from '@nino/ds/components/Text'
import type { CustomerBackLink } from '@pages/CustomerDetail/types/CustomerBackLink.type'
import type { CustomerOrderRowModel } from '@pages/CustomerDetail/types/CustomerOrderRowModel.type'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './CustomerOrderRow.module.css'

type CustomerOrderRowProps = {
  order: CustomerOrderRowModel
  backToCustomer: CustomerBackLink
  index: number
}

export const CustomerOrderRow = ({
  order,
  backToCustomer,
  index,
}: CustomerOrderRowProps) => (
  <Link
    to={order.href}
    relative="path"
    state={{ from: backToCustomer }}
    className={`${motion.lift} ${styles.orderLink}`}
    style={riseDelay(index * 40 + 80)}
  >
    <Text
      as="span"
      size="sm"
      weight="extrabold"
      font="display"
      color="strong"
      className={styles.orderNumber}
    >
      #{order.number}
    </Text>

    <Badge
      size="sm"
      variant={order.statusVariant}
      className={styles.orderStatus}
    >
      {order.statusLabel}
    </Badge>

    <time className={styles.orderAt} dateTime={order.createdAt}>
      {order.createdAtLabel}
    </time>

    <Text as="span" size="sm" weight="semibold" className={styles.orderTotal}>
      {order.total}
    </Text>
  </Link>
)
