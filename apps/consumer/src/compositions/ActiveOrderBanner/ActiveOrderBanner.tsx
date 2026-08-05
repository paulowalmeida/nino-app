import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { OrderRail } from '@elements/OrderRail/OrderRail'
import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus'
import { useMinutesUntil } from '@hooks/useMinutesUntil'
import { clearLastOrder, readLastOrder } from '@utils/last-order'
import { STATUS_LABEL } from '@constants/order.constants'
import { isTerminal, stageIcon } from '@utils/order-journey'

import styles from './ActiveOrderBanner.module.css'

type ActiveOrderBannerProps = {
  slug: string
}

/**
 * Quem acabou de pedir e voltou pra loja (ou deu F5) não devia ter que
 * caçar o link de acompanhamento de novo — ele fica guardado e aparece
 * aqui enquanto o pedido ainda estiver rolando.
 *
 * É o cartão da tela de acompanhamento em miniatura, de propósito: mesmo
 * selo, mesmo passo em destaque, mesmo trilho na borda de baixo. Quem toca
 * aqui já sabe o que vai encontrar do outro lado.
 */
export const ActiveOrderBanner = ({ slug }: ActiveOrderBannerProps) => {
  const [lastOrder] = useState(readLastOrder)
  const isForThisStore = lastOrder?.slug === slug

  const { data: order } = useGuestOrderStatus(
    isForThisStore ? lastOrder.orderId : undefined,
    isForThisStore ? lastOrder.token : undefined
  )

  const minutes = useMinutesUntil(order?.estimatedDeliveryAt ?? null)

  useEffect(() => {
    if (order && isTerminal(order.status)) clearLastOrder()
  }, [order])

  if (!isForThisStore || !order || isTerminal(order.status)) return null

  return (
    <Link
      to={`/${slug}/pedido/${lastOrder.orderId}?token=${lastOrder.token}`}
      className={styles.banner}
    >
      <span className={styles.icon} aria-hidden="true">
        {stageIcon(order.status)}
      </span>

      <div className={styles.body}>
        <p className={styles.flag}>
          <span className={styles.flagDot} aria-hidden="true" />
          Acompanhando ao vivo
        </p>
        <p className={styles.step}>{STATUS_LABEL[order.status]}</p>
      </div>

      {minutes !== null && minutes > 0 && (
        <p className={styles.eta}>
          <span className={styles.etaValue}>{minutes}</span>
          <span className={styles.etaUnit}>min</span>
        </p>
      )}

      <OrderRail order={order} />
    </Link>
  )
}
