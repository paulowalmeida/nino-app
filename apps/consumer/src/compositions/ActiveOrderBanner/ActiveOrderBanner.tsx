import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { useGuestOrderStatus } from '@hooks/useGuestOrderStatus'
import { clearLastOrder, readLastOrder } from '@utils/last-order'
import { STATUS_LABEL } from '@utils/order-flow'

import type { ActiveOrderBannerProps } from './ActiveOrderBanner.types'

import styles from './ActiveOrderBanner.module.css'

const TERMINAL = new Set(['DELIVERED', 'COMPLETED', 'CANCELLED'])

/**
 * Quem acabou de pedir e voltou pra loja (ou deu F5) não devia ter que
 * caçar o link de acompanhamento de novo — ele fica guardado e aparece
 * aqui enquanto o pedido ainda estiver rolando.
 */
export const ActiveOrderBanner = ({ slug }: ActiveOrderBannerProps) => {
  const [lastOrder] = useState(readLastOrder)
  const isForThisStore = lastOrder?.slug === slug

  const { data: order } = useGuestOrderStatus(
    isForThisStore ? lastOrder.orderId : undefined,
    isForThisStore ? lastOrder.token : undefined
  )

  useEffect(() => {
    if (order && TERMINAL.has(order.status)) clearLastOrder()
  }, [order])

  if (!isForThisStore || !order || TERMINAL.has(order.status)) return null

  return (
    <Link
      to={`/${slug}/pedido/${lastOrder.orderId}?token=${lastOrder.token}`}
      className={styles.banner}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.text}>{STATUS_LABEL[order.status]}</span>
      <span className={styles.cta}>Acompanhar →</span>
    </Link>
  )
}
