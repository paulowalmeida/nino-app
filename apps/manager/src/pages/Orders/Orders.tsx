import { Box } from '@nino/ds/components/Box'
import { OrdersFilters } from '@pages/Orders/components/OrdersFilters/OrdersFilters'
import { OrdersHeader } from '@pages/Orders/components/OrdersHeader/OrdersHeader'
import { OrdersQueue } from '@pages/Orders/components/OrdersQueue/OrdersQueue'

import styles from '@pages/Orders/Orders.module.css'

export const Orders = () => (
  <Box className={styles.page}>
    <OrdersHeader />
    <Box shrink={false} mb={3}>
      <OrdersFilters />
    </Box>
    <OrdersQueue />
  </Box>
)
