import type { CSSProperties } from 'react'

import { Box } from '@nino/ds/components/Box'
import { OrderStage } from '@compositions/OrderStage/OrderStage'
import { PoweredBy } from '@elements/PoweredBy/PoweredBy'
import { OrderNotFound } from '@pages/order-tracking/components/OrderNotFound/OrderNotFound'
import {
  OrderTrackingAgainLink,
} from '@pages/order-tracking/components/OrderTrackingAgainLink/OrderTrackingAgainLink'
import {
  OrderTrackingHeader,
} from '@pages/order-tracking/components/OrderTrackingHeader/OrderTrackingHeader'
import {
  OrderTrackingReassurance,
} from '@pages/order-tracking/components/OrderTrackingReassurance/OrderTrackingReassurance'
import {
  OrderTrackingSteps,
} from '@pages/order-tracking/components/OrderTrackingSteps/OrderTrackingSteps'
import {
  useOrderTrackingFacade,
} from '@pages/order-tracking/facades/useOrderTrackingFacade/useOrderTrackingFacade'
import { OrderTrackingSkeleton } from '@skeletons/OrderTrackingSkeleton/OrderTrackingSkeleton'
import { riseDelay } from '@utils/rise-delay'

import styles from './OrderTracking.module.css'
import motion from '@styles/motion.module.css'

export const OrderTracking = () => {
  const {
    backHref,
    progress,
    order,
    isPending,
    isSessionPending,
    isError,
    canAsk,
    done,
  } = useOrderTrackingFacade()

  /* Sem token e sem sessão não há como provar de quem é o pedido: a consulta
     nem sai, então esperar por ela seria um esqueleto eterno. */
  if (!isSessionPending && !canAsk) {
    return (
      <OrderNotFound backHref={backHref}>
        Abra pelo link que apareceu na hora do pedido, ou entre na sua conta
        para ver seus pedidos.
      </OrderNotFound>
    )
  }

  if (isPending || isSessionPending) return <OrderTrackingSkeleton />

  if (isError || !order) {
    return (
      <OrderNotFound backHref={backHref}>
        Confira o link — ele é o mesmo que apareceu na hora do pedido.
      </OrderNotFound>
    )
  }

  return (
    <Box
      className={styles.page}
      style={{ '--p': progress } as CSSProperties}
    >
      <Box className={styles.shell}>
        <OrderTrackingHeader
          backHref={backHref}
          orderNumber={order.orderNumber}
        />

        <OrderStage
          order={order}
          className={motion.riseIn}
          style={riseDelay(60)}
        />

        {!done && <OrderTrackingReassurance />}

        <OrderTrackingSteps order={order} />

        {done && (
          <OrderTrackingAgainLink backHref={backHref} status={order.status} />
        )}
      </Box>

      <PoweredBy />
    </Box>
  )
}
