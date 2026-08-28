import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { TableCell, TableRow } from '@nino/ds/components/Table'
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
  <TableRow className={motion.deal} style={riseDelay(index * 40 + 80)}>
    <TableCell>
      <Link
        to={order.href}
        relative="path"
        state={{ from: backToCustomer }}
        className={styles.orderLink}
      >
        <Text
          as="span"
          size="sm"
          weight="extrabold"
          font="display"
          color="strong"
        >
          #{order.number}
        </Text>
      </Link>
    </TableCell>

    <TableCell>
      <Badge size="sm" variant={order.statusVariant}>
        {order.statusLabel}
      </Badge>
    </TableCell>

    <TableCell className={styles.orderAt}>
      <time dateTime={order.createdAt}>{order.createdAtLabel}</time>
    </TableCell>

    <TableCell className={styles.orderTotal}>{order.total}</TableCell>
  </TableRow>
)
