import { useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { OrderStage } from '@pages/order-tracking/components/OrderStage/OrderStage'
import { OrderNotFound } from '@pages/order-tracking/components/OrderNotFound/OrderNotFound'
import { OrderTrackingAgainLink } from '@pages/order-tracking/components/OrderTrackingAgainLink/OrderTrackingAgainLink'
import { OrderTrackingHeader } from '@pages/order-tracking/components/OrderTrackingHeader/OrderTrackingHeader'
import { OrderTrackingReassurance } from '@pages/order-tracking/components/OrderTrackingReassurance/OrderTrackingReassurance'
import { OrderTrackingSteps } from '@pages/order-tracking/components/OrderTrackingSteps/OrderTrackingSteps'
import { OrderTrackingSkeleton } from '@pages/OrderTracking/skeletons/OrderTrackingSkeleton/OrderTrackingSkeleton'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { useScrollProgress } from '@hooks/useScrollProgress/useScrollProgress'
import type { LastOrder } from '@shared/lib/last-order/last-order'
import { readLastOrder } from '@shared/lib/last-order/last-order'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { isTerminal } from '@utils/order-journey'

import styles from '@pages/OrderTracking/OrderTracking.module.css'

const readStoreOrder = (slug: string | undefined): LastOrder | null => {
  const order = readLastOrder()

  if (!order || (slug && order.slug && order.slug !== slug)) return null

  return order
}

const NotificationsEmpty = ({ backHref }: { backHref: string }) => (
  <Box className={styles.page}>
    <Box className="flex flex-1 items-center justify-center px-5">
      <EmptyState
        size="md"
        title="Nenhum pedido em acompanhamento"
        action={
          <Link to={backHref} className="font-bold text-brand-strong">
            Voltar para a loja
          </Link>
        }
      >
        Faça um pedido para acompanhar cada atualização por aqui.
      </EmptyState>
    </Box>

    <Box className={styles.footer}>
      <PoweredBy compact />
    </Box>
  </Box>
)

export const AccountChats = () => {
  const { slug } = useParams()
  const backHref = slug ? `/${slug}` : '/'
  const [lastOrder] = useState(() => readStoreOrder(slug))
  const progress = useScrollProgress(60)
  const { data: order, isPending, isError } = useGuestOrderStatus(
    lastOrder?.orderId,
    lastOrder?.token
  )

  if (!lastOrder) return <NotificationsEmpty backHref={backHref} />

  if (isPending) return <OrderTrackingSkeleton />

  if (isError || !order) {
    return <OrderNotFound backHref={backHref} reason="invalid-link" />
  }

  const done = isTerminal(order.status)

  return (
    <Box className={styles.page} style={{ '--p': progress } as CSSProperties}>
      <Box className={styles.shell}>
        <OrderTrackingHeader
          backHref={backHref}
          orderNumber={order.orderNumber}
        />

        <OrderStage order={order} />

        {!done && <OrderTrackingReassurance />}

        <OrderTrackingSteps order={order} />

        {done && (
          <OrderTrackingAgainLink backHref={backHref} status={order.status} />
        )}
      </Box>

      <Box className={styles.footer}>
        <PoweredBy compact />
      </Box>
    </Box>
  )
}
