import { useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { useOrdersFacade } from '@pages/Orders/facades/useOrdersFacade/useOrdersFacade'

import { OrdersEmptyState } from '../components/OrdersEmptyState/OrdersEmptyState'
import { OrdersHeader } from '../components/OrdersHeader/OrdersHeader'
import { OrdersList } from '../components/OrdersList/OrdersList'
import { OrdersSkeleton } from '../components/OrdersSkeleton/OrdersSkeleton'
import styles from './AccountOrders.module.css'

export const AccountOrders = () => {
  const { slug } = useParams()
  const { orders, isOrdersPending } = useOrdersFacade()

  if (isOrdersPending) return <OrdersSkeleton />

  return (
    <Box className={styles.accountOrdersPage}>
      <OrdersHeader />
      {!orders?.length ? <OrdersEmptyState /> : null}
      {orders?.length ? <OrdersList orders={orders} slug={slug} /> : null}
    </Box>
  )
}
