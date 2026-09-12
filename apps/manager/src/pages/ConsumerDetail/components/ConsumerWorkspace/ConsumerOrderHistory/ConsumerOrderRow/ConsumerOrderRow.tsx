import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { TableCell, TableRow } from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import type { ConsumerBackLink } from '@pages/ConsumerDetail/types/ConsumerBackLink.type'
import type { ConsumerOrderRowModel } from '@pages/ConsumerDetail/types/ConsumerOrderRowModel.type'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ConsumerOrderRow.module.css'

type ConsumerOrderRowProps = {
  order: ConsumerOrderRowModel
  backToConsumer: ConsumerBackLink
  index: number
}

export const ConsumerOrderRow = ({
  order,
  backToConsumer,
  index,
}: ConsumerOrderRowProps) => (
  <TableRow className={motion.deal} style={riseDelay(index * 40 + 80)}>
    <TableCell>
      <Link
        to={order.href}
        relative="path"
        state={{ from: backToConsumer }}
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
