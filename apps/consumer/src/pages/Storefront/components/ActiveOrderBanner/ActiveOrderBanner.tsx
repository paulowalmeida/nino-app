import { useState } from 'react'
import { Link } from 'react-router'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'

import { OrderRail } from '@shared/components/OrderRail/OrderRail'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus/useGuestOrderStatus'
import { useMinutesUntil } from '@hooks/useMinutesUntil/useMinutesUntil'
import { readLastOrder } from '@utils/last-order'
import { STATUS_LABEL } from '@constants/order.constants'
import { isTerminal, stageIcon } from '@utils/order-journey'

import styles from './ActiveOrderBanner.module.css'

type ActiveOrderBannerProps = {
  slug: string
}

export const ActiveOrderBanner = ({ slug }: ActiveOrderBannerProps) => {
  const [lastOrder] = useState(readLastOrder)
  const isForThisStore = lastOrder?.slug === slug

  const { data: order } = useGuestOrderStatus(
    isForThisStore ? lastOrder.orderId : undefined,
    isForThisStore ? lastOrder.token : undefined
  )

  const minutes = useMinutesUntil(order?.estimatedDeliveryAt ?? null)

  if (!isForThisStore || !order || isTerminal(order.status)) return null

  return (
    <Link
      to={`/${slug}/pedido/${lastOrder.orderId}?token=${lastOrder.token}`}
      className={styles.banner}
    >
      <span className={styles.icon} aria-hidden="true">
        {stageIcon(order.status)}
      </span>

      <Box className={styles.body}>
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
