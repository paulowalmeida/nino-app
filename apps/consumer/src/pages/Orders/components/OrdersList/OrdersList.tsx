import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { STATUS_LABEL } from '@constants/order.constants'
import type { MyOrder } from '@custom_types/order/my-order'
import { clockLabel } from '@utils/clock'
import { brl } from '@utils/money'
import { isTerminal, stageIcon } from '@utils/order-journey'
import { riseDelay } from '@utils/rise-delay'

import { orderDateLabel } from '../../utils/order-date/order-date'
import { orderPath } from '../../utils/order-path/order-path'
import styles from './OrdersList.module.css'
import motion from '@styles/motion.module.css'

type OrdersListProps = {
  orders: MyOrder[]
  slug: string | undefined
}

export const OrdersList = ({ orders, slug }: OrdersListProps) => (
  <Box as="ul" className={styles.ordersList}>
    {orders.map((order, index) => (
      <Box
        as="li"
        key={order.id}
        className={`${motion.deal} ${styles.ordersListItem}`}
        style={riseDelay(index * 55)}
      >
        <Link to={orderPath(slug, order.id)} className={styles.ordersListLink}>
          <Text as="span" className={styles.stage} aria-hidden="true">
            {stageIcon(order.status)}
          </Text>

          <Text as="span" className={styles.ordersListBody}>
            <Text as="span" className={styles.ordersListStatus}>
              {STATUS_LABEL[order.status]}
              {!isTerminal(order.status) && (
                <Badge size="sm" className={styles.live}>
                  em andamento
                </Badge>
              )}
            </Text>
            <Text as="span" className={styles.when}>
              {orderDateLabel(order.createdAt)} · {clockLabel(order.createdAt)}
            </Text>
          </Text>

          <Text as="span" className={styles.ordersListTotal}>
            {brl(Number(order.totalAmount))}
          </Text>

          <Icon name="chevron-right" className={styles.chevron} />
        </Link>
      </Box>
    ))}
  </Box>
)
