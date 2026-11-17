import { Box } from '@nino/ds/components/Box'
import { OrderStage } from '@pages/order-tracking/components/OrderStage/OrderStage'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { OrderDetails } from '@pages/order-tracking/components/OrderDetails/OrderDetails'
import { OrderNotFound } from '@pages/order-tracking/components/OrderNotFound/OrderNotFound'
import { OrderTrackingAgainLink } from '@pages/order-tracking/components/OrderTrackingAgainLink/OrderTrackingAgainLink'
import { OrderTrackingHeader } from '@pages/order-tracking/components/OrderTrackingHeader/OrderTrackingHeader'
import { OrderTrackingReassurance } from '@pages/order-tracking/components/OrderTrackingReassurance/OrderTrackingReassurance'
import { OrderTrackingSteps } from '@pages/order-tracking/components/OrderTrackingSteps/OrderTrackingSteps'
import { useOrderTrackingFacade } from '@pages/order-tracking/facades/useOrderTrackingFacade/useOrderTrackingFacade'
import { OrderTrackingSkeleton } from '@pages/OrderTracking/skeletons/OrderTrackingSkeleton/OrderTrackingSkeleton'

import styles from './OrderTracking.module.css'

export const OrderTracking = () => {
  const {
    backHref,
    order,
    isPending,
    isSessionPending,
    isError,
    canAsk,
    done,
  } = useOrderTrackingFacade()

  if (!isSessionPending && !canAsk) {
    return <OrderNotFound backHref={backHref} reason="access" />
  }

  if (isPending || isSessionPending) return <OrderTrackingSkeleton />

  if (isError || !order) {
    return <OrderNotFound backHref={backHref} reason="invalid-link" />
  }

  return (
    <Box className={styles.orderTrackingPage}>
      <Box className={styles.orderTrackingShell}>
        <Box
          className={`${styles.hero} ${order.status === 'CANCELLED' ? styles.heroCancelled : ''}`}
        >
          <OrderTrackingHeader
            backHref={backHref}
            orderNumber={order.orderNumber}
          />

          <OrderStage order={order} />
        </Box>

        {!done && <OrderTrackingReassurance />}

        <OrderTrackingSteps order={order} />

        {order.details && (
          <OrderDetails details={order.details} channel={order.channel} />
        )}

        {done && (
          <OrderTrackingAgainLink backHref={backHref} status={order.status} />
        )}
      </Box>

      <Box className={styles.orderTrackingFooter}>
        <PoweredBy compact />
      </Box>
    </Box>
  )
}
