import { useEffect } from 'react'
import { Link } from 'react-router'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'

import { OrderRail } from '@shared/components/OrderRail/OrderRail'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { useGuestOrders } from '@shared/hooks/useGuestOrders/useGuestOrders'
import { useMinutesUntil } from '@hooks/useMinutesUntil/useMinutesUntil'
import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'
import { recordGuestOrderStatus } from '@utils/last-order'
import { STATUS_LABEL } from '@constants/order.constants'
import { isTerminal, stageIcon } from '@utils/order-journey'

import styles from './ActiveOrderBanner.module.css'

type ActiveOrderBannerProps = {
  slug: string
}

export const ActiveOrderBanner = ({ slug }: ActiveOrderBannerProps) => {
  const { consumer } = useConsumerSession()
  const [lastOrder] = useGuestOrders(slug)
  const isForThisStore = lastOrder?.slug === slug

  const { data: myOrders } = useMyOrders(!!consumer)
  const activeMyOrder = (myOrders ?? []).find(
    (myOrder) => !isTerminal(myOrder.status)
  )

  const orderId = isForThisStore ? lastOrder.orderId : activeMyOrder?.id
  const token = isForThisStore ? lastOrder.token : undefined
  const { data: order } = useGuestOrderStatus(orderId, token, !!consumer)

  const minutes = useMinutesUntil(order?.estimatedDeliveryAt ?? null)

  useEffect(() => {
    if (!order) return
    const eventAt = order.timeline.at(-1)?.at ?? order.createdAt
    recordGuestOrderStatus(order.id, order.status, eventAt)
  }, [order])

  if (!orderId || !order || isTerminal(order.status)) return null

  const query = token ? `?token=${token}` : ''

  return (
    <Link
      to={`/${slug}/pedido/${orderId}${query}`}
      className={styles.activeOrderBanner}
    >
      <span className={styles.activeOrderBannerIcon} aria-hidden="true">
        {stageIcon(order.status)}
      </span>

      <Box className={styles.activeOrderBannerBody}>
        <Text className={styles.flag}>
          <span className={styles.flagDot} aria-hidden="true" />
          Acompanhando ao vivo
        </Text>
        <Text className={styles.step}>{STATUS_LABEL[order.status]}</Text>
      </Box>

      {minutes !== null && minutes > 0 && (
        <Text className={styles.eta}>
          <Text as="span" className={styles.etaValue}>
            {minutes}
          </Text>
          <Text as="span" className={styles.etaUnit}>
            min
          </Text>
        </Text>
      )}

      <OrderRail order={order} />
    </Link>
  )
}
